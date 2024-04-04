import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function deleteBoardData() {
  await prisma.priority.deleteMany();
  await prisma.task.deleteMany();
  await prisma.list.deleteMany();
  await prisma.history.deleteMany();
  await prisma.board.deleteMany();
}

async function seedPriority() {
  const priorities = ['Low', 'Medium', 'High']
  for (const priority of priorities) {
    await prisma.priority.create({
      data: {
        name: priority
      }
    })
  }
}

async function seedBasicBoardAndLists() {
  const createdBoard = await prisma.board.create({
    data: {
      name: 'Task Board',
      lists: {
        create: [
          { name: 'To Do' },
          { name: 'Planned' },
          { name: 'In progress' },
          { name: 'Closed' },
        ],
      },
    },
  });

  return createdBoard;
}

async function seedTasks() {
  const board = await prisma.board.findFirst();
  const lists = await prisma.list.findMany();
  const priorities = await prisma.priority.findMany({
    select: { id: true }
  });

  const randomList = () => {
    const index = Math.floor(Math.random() * lists.length);
    return lists[index].id;
  };

  const randomPriority = () => {
    const index = Math.floor(Math.random() * priorities.length);
    return priorities[index].id;
  };

  for (let i = 0; i < 10; i++) {
    await prisma.task.create({
      data: {
        name: `Task ${i}`,
        description: `This is a task description for task ${i}`,
        due_date: new Date(Date.now() + Math.random() * 1000 * 60 * 60 * 24 * 7),
        priority: { connect: { id: randomPriority() } },
        list: { connect: { id: randomList() } },
        board: { connect: { id: board.id } }
      },
    });
  }
}

// Function to run the seed functions and disconnect from the Prisma client
async function seed() {
  await deleteBoardData();
  await Promise.all([seedPriority(), seedBasicBoardAndLists()]);
  await seedTasks();
  await prisma.$disconnect();
}

// Call the seed function and catch any errors
seed()
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
