import React, { Component } from 'react';
import Particles from "react-particles-js";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Clarifai from "clarifai";
import './App.css';

const app = new Clarifai.App({
    apiKey: '56d1ef9de7ad422b88a5dad9de942870'
});

const particleOptions = {
    particles: {
        number: {
            value: 100,
            density: {
                enable:true,
                value_area:800
            }
        }
    }
}
class App extends Component {
    constructor(){
        super();
        this.state = {
            input: '',
            imageUrl: '',
            boxes: [],
            route: 'signin',
            isSignedIn: false
        }

    }
    calculateFaceLocation = (data) => {
        // region_info.bounding_box
        const clarifaiFace = data.outputs[0].data.regions;
        const image = document.getElementById("inputImage");
        const width = Number(image.width);
        const height = Number(image.height);
        return clarifaiFace.map((face) =>{
            return {
                leftCol: face.region_info.bounding_box.left_col * width,
                topRow: face.region_info.bounding_box.top_row * height,
                rightCol: width - (face.region_info.bounding_box.right_col * width),
                bottomRow: height - (face.region_info.bounding_box.bottom_row * height)
            }
        })
    }

    displayFaceBox = (boxes) => {
        this.setState({boxes: boxes})
    }

    onInputChange = (event) =>{
        this.setState({input: event.target.value});
    }

    onButtonSubmit = () => {
        this.setState({imageUrl: this.state.input});
        app.models
            .predict(
                Clarifai.FACE_DETECT_MODEL,
                this.state.input)
            .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
            .catch(err => console.log(err));
    }

    onRouteChange = (route) => {
        if (route === "signout"){
            this.setState({isSignedIn: false});
        }else if (route === "home") {
            this.setState({isSignedIn: true});
        }
        this.setState({route: route});
    }

    render(){
        const {isSignedIn, imageUrl, boxes, route} = this.state;
        return (
            <div className="App">
                <Particles className="particles" params={particleOptions}/>
                <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
                { route === "home" ?
                    <div>
                        <Logo/>
                        <Rank/>
                        <ImageLinkForm
                            onInputChange={this.onInputChange}
                            onButtonSubmit={this.onButtonSubmit}
                        />
                        <FaceRecognition
                            imageUrl={imageUrl}
                            boxes = {boxes}
                        />
                    </div> :
                    (
                       route === "register" ?
                            <Register onRouteChange={this.onRouteChange}/>  :
                            <Signin onRouteChange={this.onRouteChange}/>
                    )

                }
          </div>
        );
    }
}

export default App;
