import { render, screen, fireEvent } from '@testing-library/react';
import StudentsPage from '../pages/students';
import { rest } from 'msw';
import { setupServer } from "msw/node";

const studentResponse = rest.get(
  'https://api.hatchways.io/assessment/students', (req, res, ctx) => {
    return res(ctx.json( { students: [
      { city: 'Fush\u00eb-Muhurr',
        company: 'Yadel',
        email: 'iorton0@imdb.com',
        firstName: 'Ingaberg',
        grades: [78, 100, 92, 86, 89, 88, 91, 87],
        id: 1,
        lastName: 'Orton',
        pic: 'https://storage.googleapis.com/hatchways-app.appspot.com/assessments/data/frontend/images/voluptasdictablanditiis.jpg',
        skill: 'Oracle'},
      { city: 'Sarulla',
        company: 'Blogpad',
        email: 'okearyg@g.co',
        firstName: 'Orelia',
        grades: [78, 92, 86, 80, 82, 95, 76, 84],
        id: 17,
        lastName: 'Keary',
        pic: 'https://storage.googleapis.com/hatchways-app.appspot.com/assessments/data/frontend/images/enimpariaturoptio.jpg',
        skill: 'General Surgery'
      }
    ]}))
  });

const server = setupServer(studentResponse);

beforeAll(() => {
  server.listen()
});

afterEach(() => {
  server.resetHandlers()
});

afterAll(() => {
  server.close()
});

describe('StudentsPage Component', () => {
  test('filters students by name', async () => {
    render(<StudentsPage />);
    const student = await screen.findByText('INGABERG ORTON');
    expect(student).toBeVisible();

    const inputs = screen.getAllByPlaceholderText(/Add a tag/);
    await fireEvent.change(inputs[0], {
      target: { value: 'Tag01924' }
    });

    await fireEvent.keyUp(inputs[0], { keyCode: 13, key: 'Enter', code: 'Enter' })

    await fireEvent.change(screen.getByPlaceholderText(/Search by tag/), {
      target: { value: 'T' }
    });

    const studentList = screen.getAllByRole('listitem');
    expect(studentList).toHaveLength(1);
  });
});
