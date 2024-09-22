import { redirect } from 'next/navigation';

export default function admin_dashboard() {
  redirect('student_dashboard/main_dashboard');
}