import * as Yup from 'yup';
import { subDays, setSeconds, setMinutes, setHours } from 'date-fns';
import { Op } from 'sequelize';

import Checkin from '../models/Checkin';
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(401).json({ error: 'Checkin validation  fails.' });
    }

    const studentExists = await Student.findByPk(req.params.id);

    if (!studentExists) {
      return res.status(402).json({ error: 'Student already exists.' });
    }

    const startDate = new Date();
    const enrollmentExists = await Enrollment.findOne({
      where: {
        student_id: studentExists.id,
        end_date: {
          [Op.gte]: startDate,
        },
      },
    });

    if (!enrollmentExists) {
      return res.status(403).json({ error: 'Student is not enrolled.' });
    }

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
      return res.status(404).json({ error: 'Only 5 check-in allowed week.' });
    }

    const checkin = await Checkin.create({
      student_id: studentExists.id,
    });

    return res.json(checkin);
  }

  async index(req, res) {
    if (!req.params.id) {
      return res.status(401).json({ error: 'Checkin validation fails.' });
    }

    const studentExists = await Student.findByPk(req.params.id);

    if (!studentExists) {
      return res.status(402).json({ error: 'Student already exists.' });
    }

    const checkins = await Checkin.findAll({
      where: { student_id: studentExists.id },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return res.json(checkins);
  }
}

export default new CheckinController();
