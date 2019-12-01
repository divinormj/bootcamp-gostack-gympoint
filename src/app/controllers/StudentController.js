import * as Yup from 'yup';
import { Op } from 'sequelize';

import Student from '../models/Student';
// import Enrollment from '../models/Enrollment';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().integer(),
      height: Yup.number(),
      weight: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Student validation  fails.' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }
    const { id, name, email, age, height, weight } = await Student.create(
      req.body
    );

    return res.json({ id, name, email, age, height, weight });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .required(),
      name: Yup.string().required('O nome deve ser informado.'),
      email: Yup.string()
        .email()
        .required('O e-mail deve ser informado.'),
      age: Yup.number().integer(),
      height: Yup.number(),
      weight: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Student validation  fails.' });
    }

    const { id, email } = req.body;
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists.' });
    }

    if (email && email !== student.email) {
      const studentExists = await Student.findOne({ where: { email } });

      if (studentExists) {
        return res.status(400).json({ error: 'Student already exists.' });
      }
    }

    const { name, age, height, weight } = await student.update(req.body);

    return res.json({ id, name, email, age, height, weight });
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.query))) {
      return res.status(400).json({ error: 'O aluno deve ser informado.' });
    }

    const { id } = req.query;
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'O aluno não está cadastrado.' });
    }

    /* const countEnrollment = await Enrollment.count({ where: { student_id } });

    if(countEnrollment > 1) {
      return res.status(400).json({ error: 'O aluno já foi matriculado, seu registro não pode mais ser excluído.' });
    } */

    try {
      await student.destroy();
    } catch (err) {
      if (JSON.stringify(err).search('ExecConstraints') > 0) {
        return res
          .status(400)
          .send('O aluno já foi matriculado, não pode ser excluído.');
      }

      return res.status(400).send('Ocorreu uma falha ao excluir o aluno.');
    }

    return res.status(200).json('Registro excluído com sucesso!');
  }

  async show(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'O aluno não está cadastrado.' });
    }

    return res.json(student);
  }

  async index(req, res) {
    const { student_name } = req.query;

    const students = await Student.findAll({
      where: {
        name: {
          [Op.iLike]: `%${student_name || ''}%`,
        },
      },
      order: ['name'],
    });

    return res.json(students);
  }
}

export default new StudentController();
