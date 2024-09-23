import { redirect } from 'next/navigation';

export default function admin_dashboard() {
  redirect('teacher_dashboard/main_dashboard');
}