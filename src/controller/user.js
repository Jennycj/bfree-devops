const express = require('express');
const User = require('../model/user');
const mongodb = require("mongodb").MongoClient;
const path = require('path');
const csvtojson = require('csvtojson')

function createUser(req, res) {
    const {id, name} = req.body;

    try {
        const user = new User({
            id,
            name
        })
        user.save();
        res.status(200).json({message:'OK'})

    }catch (error){

    }
}

async function getAllUsers(req, res) {
    try {
        const allUsers = await User.find()
        console.log(allUsers);
        if (allUsers.length > 0) {
            res.status(200).json({ message: 'OK', allUsers })
        }
        else {
            res.status(400).json({ message: 'data not found' });
        };
    } catch (error) {
    return res.status(400).send(error.message);
    }
}

async function getUserByID(req, res) {
    try {
        const id = +req.params.userId;
        const request = await User.find({id: id});
        console.log(request);
        if (request.length > 0) {
            res.status(200).json({message: 'OK', request})
        }
        else {
            res.status(404).json({message: 'User not found'})
        }
        
    } catch (error) {
        return res.status(400).send(error.message);
    }
    
}

function loadCsvData() {
 let temp; 
 const csvFilePath = path.resolve('data.csv');

    csvtojson()
    .fromFile(csvFilePath)
    .then(csvData => {
       const findUser = User.find()
       let csvNames = []
       for(let names of csvData){
           csvNames.push(names.name)
       }
       for(let i=0;i<csvData;i++){  
            temp = parseFloat(csvData[i].id)  
            csvData[i].id = temp;  
       } 
         findUser.then((user) => {
            let originalNames = []

            for(let name of user){
                originalNames.push(name.name)
            }
            
            if(originalNames.includes(csvNames[0])){
                console.log('csv has already been loaded')

            }else{
                
                try {
                mongodb.connect(process.env.DATABASE_URL_ATLAS, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true,
                    useFindAndModify: false,
                },
                (err, client) => {
                    if (err) throw err;
                
                    client
                    .db("organization")
                    .collection("users")
                    User.insertMany(csvData, (err, res) => {
                    if (err) throw err;
                
                    console.log("CSV Data loaded");
                    client.close();
                        });
                }
                )
                } catch (error) {
                    throw error
                } 
            }   
        })   
    });
}
loadCsvData()

module.exports = {createUser, getAllUsers, getUserByID};