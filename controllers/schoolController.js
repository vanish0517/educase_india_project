const pool = require('../config/db');
const{calculateDistance} = require('../utils/distance');

const addSchool = async (req, res) => {
    const{name , address, latitude, longitude} = req.body;
    //step1 : check whether all the fields are present or not
    if(!name || !address || !latitude || !longitude){
        return res.status(400).json({
            success : false,
            message : "All fields are required"
        }
        );
    }
    //step2 : check if name and address are empty or not
    if(name.trim() === "" || address.trim() === ""){
        return res.status(400).json({
            success : false,
            message : "Name and address cannot be empty"
        });
    }
    //step3 check latitude and longitude are valid or not
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    if(isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180){
        return res.status(400).json({
            success : false,
            message : "Invalid latitude or longitude"
        });
    }
    try{
    //check if school with same name and address already exists
    const [schools] = await pool.execute("SELECT * FROM schools");
    const existingSchool = schools.find(school => school.name === name && school.address === address);
    if(existingSchool){
        return res.status(400).json({
            success : false,
            message : "School with same name and address already exists"
        });
    }
    //add school to the database
    const query = "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
        const [result] = await pool.execute(query, [name.trim(), address.trim(), lat, lon]);
        return res.status(201).json({
            success : true,
            message : "School added successfully"
        });
    } catch(error) {
        console.error('addSchool error:', error.message, '| Code:', error.code);
        return res.status(500).json({
            success : false,
            message : "Error adding school",
            error   : error.message
        });
    }
}

const listSchools = async (req, res) => {
    const{ latitude, longitude } = req.query;
    //validate latitude and longitude
    const lon = parseFloat(longitude);
    const lat = parseFloat(latitude);
    if(!latitude || !longitude){
        return res.status(400).json({
            success : false,
            message : "Latitude and longitude are required"
        });
    }
    if(isNaN(lat) || isNaN(lon)){
        return res.status(400).json({
            success : false,
            message : "Invalid latitude or longitude"
        });
    }
    //fetch all schools from the database
    const query = "SELECT * FROM schools";
    try{
        const [schools] = await pool.execute(query);
        //calculate distance of each school from the given location
        const schoolsWithDistance = schools.map(school => {
            const distance = calculateDistance(lat, lon, school.latitude, school.longitude);
            return {...school, distance};
        });
        //sort schools by distance
        schoolsWithDistance.sort((a, b) => a.distance - b.distance);
        return res.status(200).json({
            success : true,
            data : schoolsWithDistance
        });
    } catch(error) {
        console.error('listSchools error:', error.message, '| Code:', error.code);
        return res.status(500).json({
            success : false,
            message : "Error fetching schools",
            error   : error.message
        });
    }
}
module.exports = { addSchool, listSchools };