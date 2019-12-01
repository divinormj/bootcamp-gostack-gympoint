import * as Yup from 'yup';

import Queue from '../../lib/Queue';
import HelpOrderAnswerMail from '../jobs/HelpOrderAnswerMail';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderAnswerController {
  async update(req, res) {
    const helpOrder = await HelpOrder.findByPk(req.body.id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
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
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(helpOrders);
  }
}

export default new HelpOrderAnswerController();
