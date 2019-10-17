import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      idade: Yup.number().integer(),
      altura: Yup.number(),
      peso: Yup.number(),
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
    const { id, nome, email, idade, altura, peso } = await Student.create(
      req.body
    );

    return res.json({ id, nome, email, idade, altura, peso });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .required(),
      nome: Yup.string(),
      email: Yup.string().email(),
      idade: Yup.number().integer(),
      altura: Yup.number(),
      peso: Yup.number(),
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

    const { nome, idade, altura, peso } = await student.update(req.body);

    return res.json({ id, nome, email, idade, altura, peso });
  }
}

export default new StudentController();
