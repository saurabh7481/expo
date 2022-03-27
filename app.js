const express = require( "express" );
const cors = require( "cors" );
const dotenv = require( "dotenv" );
const path = require( "path" );
const db = require( "./src/models" );

dotenv.config();

const app = express();

//Routes
const authRoutes = require( "./src/routes/auth.routes" );

app.use( cors() );
app.use( express.json() );
app.use( express.static( path.join( __dirname, "public" ) ) );


app.use( "/api", authRoutes );


const PORT = process.env.PORT || 3000;

db.sequelize.sync().then( () => {
	app.listen( PORT, () => {
		console.log( `Server is running at ${PORT}` );
	} );
} );

