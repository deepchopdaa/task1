import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Routes ,Route} from "react-router-dom"
import Login from './Login';
import Register from './Register';
import Blog from './Blog';
import BlogDetails from './BlogDetails';
function App() {
  return (
    <div className="App">
        <Routes>
          <Route path='/' element={<Login />}/>
          <Route path='/blog' element={<Blog />}/>
          <Route path='/blog/:id' element={<BlogDetails />}/>
          <Route path='/register' element={<Register />}/>
        </Routes>
    </div>
  );
}

export default App;
