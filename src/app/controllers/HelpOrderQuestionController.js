import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderQuestionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .required(),
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Help order validation  fails.' });
    }

    const student = await Student.findByPk(req.body.student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exist.' });
    }

    const helpOrder = await HelpOrder.create(req.body);

    return res.json(helpOrder);
  }

  async index(req, res) {
    if (!req.params.student_id) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const helpOrders = await HelpOrder.findAll({
      where: { student_id: req.params.student_id },
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

export default new HelpOrderQuestionController();
