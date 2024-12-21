const Todos = require("../model/Todo");

const Create = async (req,res)=>{
    try{
        const {task} = req.body;
        const existTodo = await Todos.findOne({task});
        if(existTodo){
            return res.status(409).json({error:"Task already Exist"})
        }
        const newTodo = new Todos(req.body)
        await newTodo.save()
        return res.status(201).json({ message: "Todo created successfully", todos: newTodo });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
}

const Update = async (req,res)=>{
 try{
    const {id} = req.params;
    const existTodo = await Todos.findById(id);
    if(!existTodo){
        return res.status(404).json({message:"Todo with this Id is not exist"});
    }
    const updatedTodo = await Todos.findByIdAndUpdate(id,req.body,{new:true})
    return res.status(201).json({message:"Todo Updated successfully",todos:updatedTodo});  
 }catch(err){
    console.log(err);
    res.status(500).json({error: "Internal Server Error" })
 }
}

const Delete = async(req,res)=>{
    try{
        const {id} = req.params;
        const existTodo = await Todos.findById(id);
        if(!existTodo){
            return res.status(404).json({message:"Todo with this Id is not exist"});   
        }
        const deleteTodo = await Todos.findByIdAndDelete(id);
        return res.status(201).json({message:"Todo Deleted successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server Error" })  
    }
}

const GetAllTodos = async(req,res)=>{
    try{
        const Todo = await Todos.find();
        return res.status(200).json({ Todo });
    }catch(err){
        console.log(err);
        return res.status(500).json({error:"Internal Server Error"})
    }
}

const GetTodoById = async (req, res) => {
    try {
      const { id } = req.params;
      const TodoExist = await Todos.findById(id);
  
      if (!TodoExist) {
        return res.status(404).json({ error: "Todo not found" });
      }
      return res.status(200).json({ Todo: TodoExist });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

module.exports = {Create,Update,Delete,GetAllTodos,GetTodoById};