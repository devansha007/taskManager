 
from celery import shared_task
from django.core.mail import send_mail
from django.utils import timezone
from django.contrib.auth import get_user_model
from datetime import timedelta

User = get_user_model()


# ─── Task 1: Welcome Email ─────────────────────────────────
@shared_task
def send_welcome_email(user_id):
    """Sent right after a user registers."""
    try:
        user = User.objects.get(id=user_id)
        send_mail(
            subject='Welcome to TaskAPI! 🎉',
            message=f'''Hi {user.username},

Welcome to TaskAPI! We're glad you're here.

Here's what you can do:
- Create and manage your tasks
- Set priorities and due dates
- Track your progress

Get started now and stay productive!

— The TaskAPI Team
''',
            from_email=None,  # uses DEFAULT_FROM_EMAIL
            recipient_list=[user.email],
            fail_silently=False,
        )
        return f'Welcome email sent to {user.email}'
    except User.DoesNotExist:
        return f'User {user_id} not found'


# ─── Task 2: Daily Digest ──────────────────────────────────
@shared_task
def send_daily_digest():
    """Sent every day — summary of each user's pending tasks."""
    from tasks.models import Task

    users = User.objects.filter(is_active=True)
    sent  = 0

    for user in users:
        pending = Task.objects.filter(
            owner=user,
            status__in=['todo', 'in_progress']
        ).order_by('due_date')

        if not pending.exists():
            continue  # skip users with no pending tasks

        # Build task list text
        task_lines = []
        for task in pending:
            due = task.due_date.strftime('%b %d') if task.due_date else 'No due date'
            task_lines.append(f'  • [{task.priority.upper()}] {task.title} — {due}')

        task_list = '\n'.join(task_lines)

        send_mail(
            subject=f'Your Daily Task Digest 📋 ({pending.count()} pending)',
            message=f'''Hi {user.username},

Here's your task summary for today:

{task_list}

Stay focused and get things done!

— TaskAPI
''',
            from_email=None,
            recipient_list=[user.email],
            fail_silently=True,
        )
        sent += 1

    return f'Daily digest sent to {sent} users'


# ─── Task 3: Due Date Reminders ───────────────────────────
@shared_task
def send_due_date_reminders():
    """Sent every morning — reminds users of tasks due tomorrow."""
    from tasks.models import Task

    tomorrow = timezone.now().date() + timedelta(days=1)

    due_tasks = Task.objects.filter(
        due_date=tomorrow,
        status__in=['todo', 'in_progress']
    ).select_related('owner')

    sent = 0
    # Group tasks by user
    user_tasks = {}
    for task in due_tasks:
        user_tasks.setdefault(task.owner, []).append(task)

    for user, tasks in user_tasks.items():
        task_lines = [f'  • [{t.priority.upper()}] {t.title}' for t in tasks]
        task_list  = '\n'.join(task_lines)

        send_mail(
            subject=f'⏰ You have {len(tasks)} task(s) due tomorrow!',
            message=f'''Hi {user.username},

These tasks are due tomorrow:

{task_list}

Don't leave them to the last minute!

— TaskAPI
''',
            from_email=None,
            recipient_list=[user.email],
            fail_silently=True,
        )
        sent += 1

    return f'Due date reminders sent to {sent} users'