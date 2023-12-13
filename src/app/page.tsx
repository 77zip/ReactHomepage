'use client'

import Image from 'next/image'

//testing 3d
import React, { useRef, useState } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import ProgressBar from 'react-bootstrap/ProgressBar';
import myFont from './helvetiker_regular.typeface.json'
extend({ TextGeometry })
const font = new FontLoader().parse(myFont);

class Text3d extends React.Component {
  render() {
    var content = this.props.children;
    const { position, scale } = this.props;
    
    return(
      <mesh
        ref={null}
        position={position}
        scale={scale}>
        <textGeometry args={[content, {font, size:5, height: 1}]}/>
        <meshStandardMaterial color={'white'} />
      </mesh>
    )
  }
}

function Box(props) {
  const mesh = useRef(null)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={1}
      onClick={(event) => {
        window.open("https://github.com/", '_blank');
      }}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

function Star(props) {
  const mesh = useRef(null)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  //useFrame((state, delta) => (mesh.current.rotation.x += delta))
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <sphereGeometry args={[0.05, 32]} />
      <meshBasicMaterial color={'white'} />
    </mesh>
  )
}
//actual website

class Navbar extends React.Component {
  render() {
    var buttons = this.props.children.map(child => (
      <div className="text-center inline-block bg-slate-700 px-2 py-2 h-10 rounded-3xl mx-0.5 hover:translate-y-0.5 transition-transform	">
        {child}
      </div>
    ));
    return(
      <div className="fixed top-0 left-0 right-0 h-10">
        <div className="h-10 flex flex-row float-right">
          {buttons}
        </div>
      </div> 
    )
  }
}

class Sidebar extends React.Component {
  render() {
    var buttons = this.props.children.map(child => (
      <div className="block w-14 h-14 px-2 py-2 text-center bg-slate-700 rounded-md my-1 hover:translate-x-0.5 transition-transform	">
        {child}
      </div>
    ));

    return(
      <div className="flex top-0 bottom-0 fixed h-screen items-center">
        <div className="">
          {buttons}
        </div>
      </div> 
    )
  }
}
/*

*/

var scrollPos = 0;
function handleScroll(event) {
  const main = document.getElementById('main');
  main.scrollTop += event.deltaY;
  var limit = Math.max( main.scrollHeight, main.offsetHeight, main.clientHeight, main.scrollHeight,main.offsetHeight );
  scrollPos = main.scrollTop / limit;
}

function updateScroll(event) {
  const main = document.getElementById('main');
  var limit = Math.max( main.scrollHeight, main.offsetHeight, main.clientHeight, main.scrollHeight,main.offsetHeight );
  scrollPos = main.scrollTop / limit;
}

function Camera() {
  useFrame((state, delta, xrFrame) => {
    state.camera.position.z = 5+(scrollPos*15);
  });
  return (<></>);
}

class Card extends React.Component {
  render() {
    var content = this.props.children;
    return(
      <div className="h-screen w-screen">
        <div className="m-auto min-w-sm max-w-sm px-5 my-5 h-[15em] rounded-3xl bg-opacity-50 bg-slate-900 backdrop-blur-sm from-slate-600 to-80% bg-gradient-to-r">
          <div className="w-fit m-auto">
            {content}
          </div>
        </div> 
      </div>
    )
  }
}
class Blank extends React.Component {
  render() {
    return(
      <div className="m-auto w-fit max-w-sm px-5 my-5 h-[35em]">
      </div> 
    )
  }
}

function generateStars(count: number) {
  var res = [];
  for (var i = 0; i < count; i++) {
    var x = ((Math.random() * 1000) % 500 ) - 250;
    var y = ((Math.random() * 1000) % 500 ) - 250;
    var z = ((Math.random() * 1000) % 200 ) - 100;
    res.push(<Star position={[x/10,y/10,z/10]}/>);
  }
  return res;
}
//<Text3d font={"/fonts/helvetiker_regular.typeface.json"} position={[1,1,1]}></Text3d>
function clickHandle(e) {
  var id = e.target.attributes.href.value;
  var element = document.getElementById(id);
  var main = document.getElementById('main');
  var pos = element.getBoundingClientRect().top;
  console.log(pos);
  main.scroll({
    top: pos+main?.scrollTop, 
    left: 0, 
    behavior: 'smooth'
  });
}

export default function Home() {
  var stars = generateStars(100);
  return (
    <div className="fixed bg-slate-950 top-0 bottom-0 left-0 right-0">
      <main onWheel={handleScroll} onScroll={updateScroll} id="main" className="py-20 fixed top-0 bottom-0 left-0 right-0 overflow-scroll">
        <div className="fixed top-0 bottom-0 left-0 right-0">
          <Canvas className="pointer-events-auto">
            <Camera/>
            <pointLight position={[50, 50, 50]} distance={500} intensity={6000}/>
            <pointLight position={[-50, -50, -50]} distance={500} intensity={6000}/>
            <Text3d position={[2, 1, 2]} scale={0.1}>Home</Text3d>
            <Text3d position={[2, 1, 5]} scale={0.1}>About</Text3d>
            <Text3d position={[2, 1, 8]} scale={0.1}>Contact</Text3d>
            <Text3d position={[2, 1, 11]} scale={0.1}>Projects</Text3d>
            {stars}
          </Canvas>
        </div>
        
        <div className="my-5" id="#Home"></div>
        <Card>
          <h1>Home</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In in lorem ipsum. Nam fermentum lacus ac volutpat auctor. Morbi magna augue, auctor quis felis eu, viverra rhoncus tortor. Nullam nulla lacus, rutrum eget ligula ut, commodo vestibulum quam. Praesent imperdiet sapien arcu.</p>
        </Card>

        <div id="#About"></div>
        <Card>
          <h1>About</h1>
          <h2>✅ Language Skill</h2>
          <li>Javascript: 8/10</li>
          <li>Html: 8/10</li>
          <li>Java: 6/10</li>
          <li>Python: 5/10</li>
          <li>React: 5/10</li>
          <br/>
        </Card>

        <div id="#Contact"></div>
        <Card>
          <h1>Contact</h1>
          <p>Hello, how are you today, this is placeholder placeholder placeholder placeholder</p>
        </Card>

        <div id="#Projects"></div>
        <Card>
          <h1>Projects</h1>
          <h2>🖥️ Github</h2>
          <li>[Voxel Engine] - <a href="https://github.com/77zip/VoxelEngine">77zip/VoxelEngine</a></li>
          <li>[Fractal Renderer] - <a href="https://github.com/77zip/FractalTest">77zip/FractalTest</a></li>
          <br/>
        </Card>
      </main>
      <Navbar>
        <a onClick={clickHandle} href="#Home" >Home</a>
        <a onClick={clickHandle} href="#About">About</a>
        <a onClick={clickHandle} href="#Contact">Contact</a>
        <a onClick={clickHandle} href="#Projects">Projects</a>
      </Navbar>
      <Sidebar>
        <a href="https://github.com/77zip/" target="_blank">
          <img className="w-10 h-10" src="/github.svg"></img>
        </a>
        <a href="mailto:elihersha@gmail.com" target="_blank">
          <img className="w-10 h-10" src="/email.svg"></img>
        </a>
      </Sidebar>
    </div>
  )
}