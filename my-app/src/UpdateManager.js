

class UpdateManager {
    static update(task) {

    }
    static async delete(task) {
        console.log(task._id)
        const response = await fetch("http://localhost:5000/task/" + task._id, {method:'DELETE'});
        if(response.ok)alert("succesfully deleted task")
            
    }
}

export default UpdateManager;


/*
Human : name,age,height

string humanName1,int humanAge1, int humanHeight1
string humanName2,int humanAge2, int humanHeight2
*/