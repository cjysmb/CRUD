
const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');

router.get('/', (req,res) => {

    res.render("employee/createOrUpdate", {

        viewTitle : "Insert Employee"
    });

});


router.post('/', (req, res) => {
    
    if(req.body._id == '')

    insertRecord(req,res);

    else 

    updateRecord(req, res);

});

router.get('/list', (req, res) => {

    Employee.find((err, docs) => {

        if(!err) {
         
            res.render("employee/list", {

                list: docs
            });
        } else {

            console.log('Unable to Retrieve Data : '+err);
            
        }
    })
})

router.get('/:id', (req,res) => {

    Employee.findById(req.params.id, (err, doc) => {

        if(!err) {

            res.render("employee/createOrUpdate", {        
            viewTitle : "Update Employee",
            employee: doc
            
            });

        }
    });
});

router.get('/delete/:id', (req,res) => {

    Employee.findOneAndDelete(req.params.id, (err, doc) => {

        if(!err){

            res.redirect('employee/list');
            
        } else {

            console.log('Error in employee delete: ' + err);

        }
    });
});

function insertRecord(req,res){

    var employee = new Employee();
    employee.fullName = req.body.fullName;
    employee.email = req.body.email;
    employee.mobile = req.body.mobile;
    employee.city = req.body.city;
    employee.save((err, doc) => {

        if (!err) {

            res.redirect('employee/list');

        } else  {
            
            if(err.name == 'ValidationError') {

                handleValidationError(err, req.body);
                res.render("employee/createOrUpdate", {

                    viewTitle : "Insert Employee",
                    employee: req.body
                });

            } else {

                console.log('Error! When Creating an Employee : ' +err); 

            }
        }
    });
}

function updateRecord(req, res) {

    Employee.findOneAndUpdate({ _id: req.body._id}, req.body, {new: true }, (err, doc) => {

        if (!err) {

            res.redirect('employee/list');

        } else {

            if(err.name == 'ValidationError') {

                handleValidationError(err, req.body);
                res.render("employee/createOrUpdate", {

                    viewTitle : "Update Employee",
                    employee: req.body
                });

            } else {

                console.log('Error! When Creating an Employee : ' +err); 

            }  
        }
    })
}

function handleValidationError(err, body) {

    for(field in err.errors) {

        switch (err.errors[field].path) {

            case 'fullName': body['fullNameError'] = err.errors[field].message;
            break;

            case 'email': body['emailError'] = err.errors[field].message;
            break;

            default: 
            break;
        }
    }
}

module.exports = router;