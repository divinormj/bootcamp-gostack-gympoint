import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class ConfirmEnrollmentMail {
  get key() {
    return 'ConfirmEnrollmentMail';
  }

  async handle({ data }) {
    const { enrollment, student, plan } = data;
    // Create our number formatter.
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    await Mail.sendMail({
      to: `${student.name}<${student.email}>`,
      subject: 'Confirmação de Matrícula',
      template: 'confirmEnrollment',
      context: {
        student: student.name,
        plan: plan.title,
        start_date: format(parseISO(enrollment.start_date), 'dd/MM/yyyy', {
          locale: pt,
        }),
        end_date: format(parseISO(enrollment.end_date), 'dd/MM/yyyy', {
          locale: pt,
        }),
        price: formatter.format(plan.price),
      },
    });
  }
}

export default new ConfirmEnrollmentMail();
