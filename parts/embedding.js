const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String,
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model(
  'Course',
  new mongoose.Schema({
    name: String,
    authors: [authorSchema],
  }),
);

async function createCourse(name, authors) {
  const course = new Course({
    name,
    authors,
  });

  const result = await course.save();
  console.log(result);
}

// $unset delete prop for 'author.name'
async function updateCourse(courseId) {
  const course = await Course.update(
    { _id: courseId },
    { $unset: { 'author.name': '' } },
  );

  console.log('update course', course);
}

// updateCourse('5bde7e0b9b0fdb158c00fc95')

async function listCourses() {
  const courses = await Course.find();
  console.log(courses);
}

// createCourse('Node Course', [
//   new Author({ name: 'John' }),
//   new Author({ name: 'Smith' }),
// ]);

async function addAuthor(courseId, author) {
  try {
    const course = await Course.findById(courseId);

    console.log('course', course);

    course.authors.push(author);

    const _course = await course.save();

    console.log('add author for course', _course);
  } catch (error) {
    console.log('error', error.message);
  }
}

async function removeAuthor(courseId, authorId) {
  try {
    const course = await Course.findById(courseId);

    const author = course.authors.id(authorId);

    author.remove();

    const _course = await course.save();

    console.log('_course',_course);
    
  } catch (error) {
    console.log('error', error.message);
  }
}

// addAuthor('5bde81a50f13c32c6c57efda', new Author({ name: 'Amy' }));
removeAuthor('5bde81a50f13c32c6c57efda','5bde83a3d606cc25bce822a1')