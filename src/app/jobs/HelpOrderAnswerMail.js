import Mail from '../../lib/Mail';

class HelpOrderAnswerMail {
  get key() {
    return 'HelpOrderAnswerMail';
  }

  async handle({ data }) {
    const { helpOrder } = data;

    console.log('A fila help executou');

    await Mail.sendMail({
      to: `${helpOrder.student.nome}<${helpOrder.student.email}>`,
      subject: 'Resposta de pedido de auxílio',
      template: 'helpOrderAnswer',
      context: {
        student: helpOrder.student.nome,
        question: helpOrder.question,
        answer: helpOrder.answer,
      },
    });
  }
}

export default new HelpOrderAnswerMail();
