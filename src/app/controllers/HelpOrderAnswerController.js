import * as Yup from 'yup';

import Queue from '../../lib/Queue';
import HelpOrderAnswerMail from '../jobs/HelpOrderAnswerMail';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderAnswerController {
  async store(req, res) {
    const schema = Yup.object().shape({
      help_order_id: Yup.number()
        .integer()
        .required(),
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Help order validation  fails.' });
    }

    const helpOrder = await HelpOrder.findByPk(req.body.help_order_id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['nome', 'email'],
        },
      ],
    });

    if (!helpOrder) {
      return res.status(400).json({ error: 'Help does not exists.' });
    }

    helpOrder.answer = req.body.answer;
    helpOrder.answer_at = new Date();

    await helpOrder.save();

    await Queue.add(HelpOrderAnswerMail.key, { helpOrder });

    return res.json(helpOrder);
  }

  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: { answer_at: null },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['nome', 'email'],
        },
      ],
    });

    return res.json(helpOrders);
  }
}

export default new HelpOrderAnswerController();
