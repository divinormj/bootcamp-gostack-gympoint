import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class ConfirmEnrollmentMail {
  get key() {
    return 'ConfirmEnrollmentMail';
  }

  async handle({ data }) {
    const { enrollment, student, plan } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${student.nome}<${student.email}>`,
      subject: 'Confirmação de Matrícula',
      template: 'confirmEnrollment',
      context: {
        student: student.nome,
        plan: plan.title,
        start_date: format(parseISO(enrollment.start_date), 'dd/MM/yyyy', {
          locale: pt,
        }),
        end_date: format(parseISO(enrollment.end_date), 'dd/MM/yyyy', {
          locale: pt,
        }),
        price: plan.price,
      },
    });
  }
}

export default new ConfirmEnrollmentMail();
