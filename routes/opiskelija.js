var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display books page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM opiskelija ORDER BY id',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/opiskelija/index.ejs
            res.render('opiskelija',{data:''});   
        } else {
            // render to views/opiskelija/index.ejs
            res.render('opiskelija',{data:rows});
        }
    });
});

// display add opiskelija page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('opiskelija/add', {
        etunimi: '',
        sukunimi: '',
        osoite: '',
        luokkatunnus: ''        
    })
})

// add a new opiskelija
router.post('/add', function(req, res, next) {    

    let etunimi = req.body.etunimi;
    let sukunimi = req.body.sukunimi;
    let osoite = req.body.osoite;
    let luokkatunnus = req.body.luokkatunnus;
    let errors = false;

    if(etunimi.length === 0 || sukunimi.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter etunimi and sukunimi");
        // render to add.ejs with flash message
        res.render('opiskelija/add', {
            etunimi: etunimi,
            sukunimi: sukunimi,
            osoite: osoite,
            luokkatunnus: luokkatunnus
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            etunimi: etunimi,
            sukunimi: sukunimi,
            osoite: osoite,
            luokkatunnus: luokkatunnus
        }
        
        // insert query
        dbConn.query('INSERT INTO opiskelija SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('opiskelija/add', {
                    etunimi: form_data.etunimi,
                    sukunimi: form_data.sukunimi,
                    osoite: form_data.osoite,
                    luokkatunnus: form_data.luokkatunnus                    
                })
            } else {                
                req.flash('success', 'Opiskelija successfully added');
                res.redirect('/opiskelija');
            }
        })
    }
})

// display edit opiskelija page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM opiskelija WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Opiskelija not found with id = ' + id)
            res.redirect('/opiskelija')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('opiskelija/edit', {
                title: 'Edit Opiskelija', 
                id: rows[0].id,
                etunimi: rows[0].etunimi,
                sukunimi: rows[0].sukunimi,
                osoite: rows[0].osoite,
                luokkatunnus: rows[0].luokkatunnus
            })
        }
    })
})

// update opiskelija data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let etunimi = req.body.etunimi;
    let sukunimi = req.body.sukunimi;
    let osoite = req.body.osoite;
    let luokkatunnus = req.body.luokkatunnus;
    let errors = false;

    if(etunimi.length === 0 || sukunimi.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter etunimi and sukunimi");
        // render to add.ejs with flash message
        res.render('opiskelija/edit', {
            id: req.params.id,
            etunimi: etunimi,
            sukunimi: sukunimi,
            osoite: osoite,
            luokkatunnus: luokkatunnus
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            etunimi: etunimi,
            sukunimi: sukunimi,
            osoite: osoite,
            luokkatunnus: luokkatunnus
        }
        // update query
        dbConn.query('UPDATE opiskelija SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('opiskelija/edit', {
                    id: req.params.id,
                    etunimi: form_data.etunimi,
                    sukunimi: form_data.sukunimi,
                    osoite: form_data.osoite,
                    luokkatunnus: form_data.luokkatunnus
                })
            } else {
                req.flash('success', 'Opiskelija successfully updated');
                res.redirect('/opiskelija');
            }
        })
    }
})
   
// delete opiskelija
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM opiskelija WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to opiskelija page
            res.redirect('/opiskelija')
        } else {
            // set flash message
            req.flash('success', 'Opiskelija successfully deleted! id = ' + id)
            // redirect to books page
            res.redirect('/opiskelija')
        }
    })
})

module.exports = router;