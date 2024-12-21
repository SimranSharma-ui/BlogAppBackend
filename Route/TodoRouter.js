const express = require("express");
const { Create, Update, Delete, GetAllTodos, GetTodoById } = require("../controller/TodoController");

const router = express.Router();

router.post("/Create",Create);
router.put("/Update/:id",Update);
router.delete("/Delete/:id",Delete);
router.get("/AllTodos",GetAllTodos);
router.get("/GetOneTodo/:id",GetTodoById);

module.exports = router;