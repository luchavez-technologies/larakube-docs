---
sidebar_position: 5
---
# Task Scheduling

The Laravel Command Scheduler allows you to fluently and expressively define your command schedule within Laravel itself.

## 🧱 The LaraKube Strategy
In a Kubernetes environment, running a traditional `cron` daemon can be complex. LaraKube simplifies this by creating a dedicated **CronJob** resource:

1.  **Isolated Runner:** Scheduling runs in its own lightweight pod, separate from your web workers.
2.  **Deterministic Execution:** It triggers `php artisan schedule:run` every minute, exactly as Laravel expects.
3.  **Resource Efficient:** The pod only exists for the duration of the scheduled task, saving cluster memory and CPU.

## Configuration
There is no extra configuration needed in Kubernetes! Simply define your schedule in `routes/console.php` (Laravel 11+) or `app/Console/Kernel.php` (Legacy), and LaraKube handles the rest.

## Logs
To see the output of your scheduled tasks, you can use the K9s dashboard (`larakube dashboard`) or check the logs of the most recent scheduler pod.
