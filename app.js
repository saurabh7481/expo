const express = require( "express" );
const cors = require( "cors" );
const dotenv = require( "dotenv" );
const cookieParser = require( "cookie-parser" );
const path = require( "path" );
const db = require( "./src/models" );

dotenv.config();

const app = express();

//Routes
const authRoutes = require( "./src/routes/auth.routes" );
const expenseRoutes = require( "./src/routes/expense.routes" );

app.use( cors() );
app.use( cookieParser() );
app.use( express.json() );
app.use( express.static( path.join( __dirname, "public" ) ) );


app.use( "/api", authRoutes );
app.use( "/api/expense", expenseRoutes );


const PORT = process.env.PORT || 3000;

db.sequelize.sync().then( () => {
	app.listen( PORT, () => {
		console.log( `Server is running at ${PORT}` );
	} );
} );

