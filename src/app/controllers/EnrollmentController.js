import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';

import Queue from '../../lib/Queue';
import ConfirmEnrollmentMail from '../jobs/ConfirmEnrollmentMail';

import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';

class EnrollmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .required(),
      plan_id: Yup.number()
        .integer()
        .required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { plan_id, student_id, start_date } = req.body;

    const studentExists = await Student.findOne({
      where: { id: student_id },
    });

    if (!studentExists) {
      return res.status(400).json({ error: 'Student does not exists.' });
    }

    const planExists = await Plan.findOne({
      where: { id: plan_id },
    });

    if (!planExists) {
      return res.status(400).json({ error: 'Plan does not exists.' });
    }

    // Data está no formato Date (yyyy-MM-dd);
    const startDate = parseISO(start_date);
    const endDate = addMonths(startDate, planExists.duration);
    const price = planExists.total_price;

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date: startDate,
      end_date: endDate,
      price,
    });

    await Queue.add(ConfirmEnrollmentMail.key, {
      enrollment,
      student: studentExists,
      plan: planExists,
    });

    return res.json({
      id: enrollment.id,
      student_id,
      plan_id,
      startDate,
      endDate,
      price,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .required(),
      plan_id: Yup.number().integer(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { id, plan_id, start_date } = req.body;

    const enrollment = await Enrollment.findByPk(id);

    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment does not exists.' });
    }

    if (plan_id) {
      const planExists = await Plan.findOne({
        where: { id: plan_id },
      });

      if (planExists) {
        enrollment.plan = planExists;
      } else {
        return res.status(400).json({ error: 'Plan does not exists.' });
      }
    }

    if (start_date) {
      const startDate = parseISO(start_date);
      const endDate = addMonths(startDate, enrollment.plan.duration);

      enrollment.start_date = startDate;
      enrollment.end_date = endDate;
      enrollment.price = enrollment.plan.total_price;
    }

    await enrollment.save();

    return res.json({
      id,
      student_id: enrollment.student_id,
      plan_id,
      start_date,
      end_date: enrollment.end_date,
      price: enrollment.price,
    });
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.query))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const enrollment = await Enrollment.findByPk(req.query.id);

    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment does not exists.' });
    }

    enrollment.destroy();

    return res.json();
  }

  async show(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title'],
        },
      ],
    });

    return res.json(enrollment);
  }

  async index(req, res) {
    const enrollments = await Enrollment.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title'],
        },
      ],
      order: ['start_date'],
    });

    return res.json(enrollments);
  }
}

export default new EnrollmentController();
