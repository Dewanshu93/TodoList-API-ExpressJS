const express = require('express')
const app = express()
app.use(express.json())
const path = require('path')
const dbPath = path.join(__dirname, 'todoApplication.db')
let database = null
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const format = require('date-fns/format')
const isMatch = require('date-fns/isMatch')
var isValid = require('date-fns/isValid')

const initializeDBandServer = async () => {
  try {
    database = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}

initializeDBandServer()

const isStatusGiven = requestQuery => {
  return requestQuery.status !== undefined
}

const isPriorityandStatusGiven = requestQuery => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  )
}

const isPriorityGiven = requestQuery => {
  return requestQuery.priority !== undefined
}

const isCategoryandStatusGiven = requestQuery => {
  return (
    requestQuery.category !== undefined && requestQuery.status !== undefined
  )
}
const isCategoryAndPriorityGiven = requestQuery => {
  return (
    requestQuery.category !== undefined && requestQuery.priority !== undefined
  )
}
const isCategoryGiven = requestQuery => {
  return requestQuery.category !== undefined
}
const isSearchGiven = requestQuery => {
  return requestQuery.search_q !== undefined
}

app.get('/todos/', async (request, response) => {
  const {priority, status, category, search_q = ''} = request.query
  console.log(status)
  let getSqlQuery
  let todoDetail
  switch (true) {
    case isPriorityandStatusGiven(request.query):
      if (priority === 'HIGH' || priority === 'MEDIUM' || priority === 'LOW') {
        if (
          status === 'TO DO' ||
          status === 'IN PROGRESS' ||
          status === 'DONE'
        ) {
          getSqlQuery = `
            SELECT
              *
            FROM
              todo
            WHERE
              priority = '${priority}' AND status ='${status}';`
          todoDetail = await database.all(getSqlQuery)
          response.send(
            todoDetail.map(todo => {
              return {
                id: todo.id,
                todo: todo.todo,
                priority: todo.priority,
                status: todo.status,
                category: todo.category,
                dueDate: todo.due_date,
              }
            }),
          )
        } else {
          response.status(400)
          response.send('Invalid Todo Status')
        }
      } else {
        response.status(400)
        response.send('Invalid Todo Priority')
      }
      break

    case isCategoryandStatusGiven(request.query):
      if (
        category === 'WORK' ||
        category === 'HOME' ||
        category === 'LEARNING'
      ) {
        if (
          status === 'TO DO' ||
          status === 'IN PROGRESS' ||
          status === 'DONE'
        ) {
          getSqlQuery = `
            SELECT
              *
            FROM
              todo
            WHERE
              category = '${category}' AND status = '${status}';`
          todoDetail = await database.all(getSqlQuery)
          response.send(
            todoDetail.map(todo => {
              return {
                id: todo.id,
                todo: todo.todo,
                priority: todo.priority,
                status: todo.status,
                category: todo.category,
                dueDate: todo.due_date,
              }
            }),
          )
        } else {
          response.status(400)
          response.send('Invalid Todo Status')
        }
      } else {
        response.status(400)
        response.send('Invalid Todo Category')
      }

      break

    case isCategoryAndPriorityGiven(request.query):
      if (
        category === 'WORK' ||
        category === 'HOME' ||
        category === 'LEARNING'
      ) {
        if (
          priority === 'HIGH' ||
          priority === 'MEDIUM' ||
          priority === 'LOW'
        ) {
          getSqlQuery = `
              SELECT
                *
              FROM
                todo
              WHERE
                category='${category}' AND priority='${priority}';`
          todoDetail = await database.all(getSqlQuery)
          response.send(
            todoDetail.map(todo => {
              return {
                id: todo.id,
                todo: todo.todo,
                priority: todo.priority,
                status: todo.status,
                category: todo.category,
                dueDate: todo.due_date,
              }
            }),
          )
        } else {
          response.status(400)
          response.send('Invalid Todo Priority')
        }
      } else {
        response.status(400)
        response.send('Invalid Todo Category')
      }
      break

    case isStatusGiven(request.query):
      if (status === 'TO DO' || status === 'IN PROGRESS' || status === 'DONE') {
        getSqlQuery = `
            SELECT
              *
            FROM
              todo
            WHERE
              status='${status}';`
        todoDetail = await database.all(getSqlQuery)
        response.send(
          todoDetail.map(todo => {
            return {
              id: todo.id,
              todo: todo.todo,
              priority: todo.priority,
              status: todo.status,
              category: todo.category,
              dueDate: todo.due_date,
            }
          }),
        )
      } else {
        response.status(400)
        response.send('Invalid Todo Status')
      }
      break

    case isPriorityGiven(request.query):
      if (priority === 'HIGH' || priority === 'MEDIUM' || priority === 'LOW') {
        getSqlQuery = `
            SELECT
              *
            FROM
              todo
            WHERE
              priority='${priority}';`
        todoDetail = await database.all(getSqlQuery)
        response.send(
          todoDetail.map(todo => {
            return {
              id: todo.id,
              todo: todo.todo,
              priority: todo.priority,
              status: todo.status,
              category: todo.category,
              dueDate: todo.due_date,
            }
          }),
        )
      } else {
        response.status(400)
        response.send('Invalid Todo Priority')
      }
      break

    case isSearchGiven(request.query):
      getSqlQuery = `
            SELECT
              *
            FROM
              todo
            WHERE todo LIKE '%${search_q}%';`
      todoDetail = await database.all(getSqlQuery)
      response.send(
        todoDetail.map(todo => {
          return {
            id: todo.id,
            todo: todo.todo,
            priority: todo.priority,
            status: todo.status,
            category: todo.category,
            dueDate: todo.due_date,
          }
        }),
      )
      break
    case isCategoryGiven(request.query):
      if (
        category === 'WORK' ||
        category === 'HOME' ||
        category === 'LEARNING'
      ) {
        getSqlQuery = `
                SELECT
                  *
                FROM
                  todo
                WHERE
                  category='${category}';`
        todoDetail = await database.all(getSqlQuery)
        response.send(
          todoDetail.map(todo => {
            return {
              id: todo.id,
              todo: todo.todo,
              priority: todo.priority,
              status: todo.status,
              category: todo.category,
              dueDate: todo.due_date,
            }
          }),
        )
      } else {
        response.status(400)
        response.send('Invalid Todo Category')
      }
      break
    default:
      getSqlQuery = `
          SELECT
            *
          FROM
            todo;`
      todoDetail = await database.all(getSqlQuery)
      response.send(
        todoDetail.map(todo => {
          return {
            id: todo.id,
            todo: todo.todo,
            priority: todo.priority,
            status: todo.status,
            category: todo.category,
            dueDate: todo.due_date,
          }
        }),
      )
  }
})

app.get('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const getSingleTodoSqlQuery = `
            SELECT
              *
            FROM
              todo
            WHERE
              id=${todoId};`
  const singleTodo = await database.get(getSingleTodoSqlQuery)
  response.send({
    id: singleTodo.id,
    todo: singleTodo.todo,
    priority: singleTodo.priority,
    status: singleTodo.status,
    category: singleTodo.category,
    dueDate: singleTodo.due_date,
  })
})

app.get('/agenda/', async (request, response) => {
  const {date} = request.query
  if (isMatch(date, 'yyyy-MM-dd')) {
    const newDate = format(new Date(date), 'yyyy-MM-dd')
    const getTodowithDateSqlQuery = `
              SELECT
                *
              FROM
                todo
              WHERE
                due_date='${newDate}';`
    const todowithDate = await database.all(getTodowithDateSqlQuery)
    response.send(todowithDate.map((todo)=>{
      return {
      id: todo.id,
      todo: todo.todo,
      priority: todo.priority,
      status: todo.status,
      category: todo.category,
      dueDate: todo.due_date,
    }
    }))
  } else {
    response.status(400)
    response.send('Invalid Due Date')
  }
})

app.post('/todos/', async (request, response) => {
  const {id, todo, priority, status, category, dueDate} = request.body
  if (priority === 'HIGH' || priority === 'LOW' || priority === 'MEDIUM') {
    if (status === 'TO DO' || status === 'IN PROGRESS' || status === 'DONE') {
      if (
        category === 'WORK' ||
        category === 'HOME' ||
        category === 'LEARNING'
      ) {
        if (isMatch(dueDate, 'yyyy-MM-dd')) {
          const postNewDueDate = format(new Date(dueDate), 'yyyy-MM-dd')
          const createTodoSqlQuery = `
              INSERT INTO
                  todo(id, todo, priority, status, category, due_date)
              VALUES(
                ${id},
                '${todo}',
                '${priority}',
                '${status}',
                '${category}',
                '${postNewDueDate}'
              );`
          await database.run(createTodoSqlQuery)
          response.send('Todo Successfully Added')
        } else {
          response.status(400)
          response.send('Invalid Due Date')
        }
      } else {
        response.status(400)
        response.send('Invalid Todo Category')
      }
    } else {
      response.status(400)
      response.send('Invalid Todo Status')
    }
  } else {
    response.status(400)
    response.send('Invalid Todo Priority')
  }
})

app.put('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params

  const requestBody = request.body
  const previousTodoQuery = `
                SELECT
                  *
                FROM
                  todo
                WHERE
                  id=${todoId};`
  const previousTodo = await database.get(previousTodoQuery)

  const {
    todo = previousTodo.todo,
    category = previousTodo.category,
    priority = previousTodo.priority,
    status = previousTodo.status,
    dueDate = previousTodo.dueDate,
  } = request.body
  let updateTodoSqlQuery
  switch (true) {
    case requestBody.status !== undefined:
      if (status === 'TO DO' || status === 'IN PROGRESS' || status === 'DONE') {
        updateTodoSqlQuery = `
            UPDATE
              todo
            SET
              status='${status}'
            WHERE
              id=${todoId};`
        await database.run(updateTodoSqlQuery)
        response.send('Status Updated')
      } else {
        response.status(400)
        response.send('Invalid Todo Status')
      }
      break

    case requestBody.priority !== undefined:
      if (priority === 'HIGH' || priority === 'LOW' || priority === 'MEDIUM') {
        updateTodoSqlQuery = `
            UPDATE
              todo
            SET
              priority='${priority}'
            WHERE
              id=${todoId};`
        await database.run(updateTodoSqlQuery)
        response.send('Priority Updated')
      } else {
        response.status(400)
        response.send('Invalid Todo Priority')
      }
      break

    case requestBody.category !== undefined:
      if (
        category === 'WORK' ||
        category === 'HOME' ||
        category === 'LEARNING'
      ) {
        updateTodoSqlQuery = `
            UPDATE
              todo
            SET
              category='${category}'
            WHERE
              id=${todoId};`
        await database.run(updateTodoSqlQuery)
        response.send('Category Updated')
      } else {
        response.status(400)
        response.send('Invalid Todo Category')
      }
      break

    case requestBody.todo !== undefined:
      updateTodoSqlQuery = `
            UPDATE
              todo
            SET
              todo='${todo}'
            WHERE
              id=${todoId};`
      await database.run(updateTodoSqlQuery)
      response.send('Todo Updated')
      break

    case requestBody.dueDate !== undefined:
      if (isMatch(dueDate, 'yyyy-MM-dd')) {
        const newDueDate = format(new Date(dueDate), 'yyyy-MM-dd')
        updateTodoSqlQuery = `
            UPDATE
              todo
            SET
              due_date='${newDueDate}'
            WHERE
              id=${todoId};`
        await database.run(updateTodoSqlQuery)
        response.send('Due Date Updated')
      } else {
        response.status(400)
        response.send('Invalid Due Date')
      }
      break
  }
})

app.delete('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const deleteSqlQuery = `
            DELETE FROM
                todo
            WHERE
                id=${todoId};`
  await database.run(deleteSqlQuery)
  response.send('Todo Deleted')
})

module.exports = app
