var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display opiskelijat page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM opiskelijat ORDER BY opiskelija desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/opiskelijat/index.ejs
            res.render('opiskelijat',{data:''});   
        } else {
            // render to views/opiskelijat/index.ejs
            res.render('opiskelijat',{data:rows});
        }
    });
});

// display add student page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('opiskelijat/add', {
        opiskelija: '',
        opintojakso: '' ,
		arviointi: ''
    })
})

// add a new student
router.post('/add', function(req, res, next) {    

    let opiskelija = req.body.opiskelija;
    let opintojakso = req.body.opintojakso;
	let arviointi = req.body.arviointi;
    let errors = false;

    if(opiskelija.length === 0 || opintojakso.length === 0 || arviointi.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter opiskelija and arviointi");
        // render to add.ejs with flash message
        res.render('opiskelijat/add', {
            opiskelija: opiskelija,
			opintojakso: opintojakso,
            arviointi: arviointi
			
			
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            opiskelija: opiskelija,
			opintojakso: opintojakso,
            arviointi: arviointi
        }
        
        // insert query
        dbConn.query('INSERT INTO opiskelijat SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('opiskelijat/add', {
                    opiskelija: form_data.opiskelija,
                    opintojakso: form_data.opintojakso,
                    arviointi: form_data.arviointi 
                })
            } else {                
                req.flash('success', 'Student successfully added');
                res.redirect('/opiskelijat');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:opiskelija)', function(req, res, next) {

    let opiskelija = req.body.opiskelija;
   
    dbConn.query('SELECT * FROM opiskelijat WHERE opiskelija = ' opiskelija, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Student not found with opiskelija = ' opiskelija)
            res.redirect('/opiskelijat')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('opiskelijat/edit', {
                title: 'Edit opiskelija', 
                id: rows[0].id,
                name: rows[0].name,
                author: rows[0].author
            })
        }
    })
})

// update book data
router.post('/update/:opiskelija', function(req, res, next) {

    let opiskelija = req.body.opiskelija;
    let opintojakso = req.body.opintojakso;
    let arviointi = req.body.arviointi;
    let errors = false;

    if(opiskelija.length === 0 || opintojakso.length === 0 || arviointi === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter opiskelija, opintojakso and arviointi");
        // render to add.ejs with flash message
        res.render('books/edit', {
            opiskelija: opiskelija,
            opintojakso: opintojakso,
            arviointi: arviointi
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            opiskelija: opiskelija,
            opintojakso: opintojakso,
			arviointi: arviointi
        }
        // update query
        dbConn.query('UPDATE opiskelijat SET ? WHERE opiskelija = ' opiskelija, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('opiskelijat/edit', {
                  
                    opiskelija: form_data.opiskelija,
                    opintojakso: form_data.opintojakso,
					arviointi: form_data.arviointi
                })
            } else {
                req.flash('success', 'Student successfully updated');
                res.redirect('/opiskelijat');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:opiskelija)', function(req, res, next) {

    let opiskelija = req.params.opiskelija;
     
    dbConn.query('DELETE FROM opiskelijat WHERE opiskelija = ' + opiskelija, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/opiskelijat')
        } else {
            // set flash message
            req.flash('success', 'Student successfully deleted! Opiskelija = ' + id)
            // redirect to books page
            res.redirect('/opiskelijat')
        }
    })
})

module.exports = router;