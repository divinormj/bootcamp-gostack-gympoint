import * as Yup from 'yup';
import { subDays, setSeconds, setMinutes, setHours } from 'date-fns';
import { Op } from 'sequelize';

import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Checkin validation  fails.' });
    }

    const studentExists = await Student.findByPk(req.params.student_id);

    if (!studentExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const startDate = new Date();
    const beforeDate = subDays(
      setSeconds(setMinutes(setHours(startDate, 0), 0), 0),
      7
    );

    const checkins = await Checkin.findAll({
      where: {
        student_id: studentExists.id,
        created_at: {
          [Op.between]: [beforeDate, startDate],
        },
      },
    });

    if (checkins && checkins.length >= 5) {
      return res.status(400).json({ error: 'Only 5 check-in allowed week.' });
    }

    const checkin = await Checkin.create(req.params);

    return res.json(checkin);
  }

  async index(req, res) {
    if (!req.params.student_id) {
      return res.status(400).json({ error: 'Checkin validation  fails.' });
    }

    const checkins = await Checkin.findAll({
      where: { student_id: req.params.student_id },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['nome'],
        },
      ],
    });

    return res.json(checkins);
  }
}

export default new CheckinController();
