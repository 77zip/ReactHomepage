'use client'
import Image from 'next/image'

//testing 3d
import React, { ChangeEvent, Component, MouseEventHandler, ReactElement, useRef, useState } from 'react'
import { Canvas, useFrame, useThree, extend, Object3DNode, Vector3, ThreeEvent, RootState, ExtendedColors, Euler } from '@react-three/fiber'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

import * as Cannon from 'cannon-es'
const world = new Cannon.World({
  gravity: new Cannon.Vec3(0, -9.8, 0), // m/s²
});

//load my font
import fontJson from './helvetiker_regular.typeface.json'
const font = new FontLoader().parse(fontJson);

//this makes vscode shut up about a stupid error, idk
extend({ TextGeometry });
declare module "@react-three/fiber" {
  interface ThreeElements {
    textGeometry: Object3DNode<TextGeometry, typeof TextGeometry>;
  }
}

//just preload some meshes to improve load time
var ObjectData = {
  star: {
    geom: <sphereGeometry args={[0.05, 32]} />,
    mat: <meshBasicMaterial color={'white'} />,
  },
  box: {
    geom: <boxGeometry args={[1, 1, 1]} />,
    mat: <meshStandardMaterial color={'orange'} />,
  }
}

//// 3D Objects
class Text3d extends React.Component <{children: string, position: Vector3, scale: number}> {
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

class Box extends React.Component <{onClick: ((event: ThreeEvent<MouseEvent>) => void), position: Vector3}> {
  render() {
    return (
      <mesh
        {...this.props}
        scale={1}
        position={this.props.position}
        onClick={this.props.onClick}>
        {ObjectData.box.geom}
        {ObjectData.box.mat}
      </mesh>
    )
  }
}

//load all star mesh stuff before hand to reduce load time
function Star(props: { position: Vector3 }) {
  return (
    <mesh position={props.position}>
      {ObjectData.star.geom}
      {ObjectData.star.mat}
    </mesh>
  )
}

//actual website
class Navbar extends React.Component <{children: Array<React.ReactElement>}> {
  render() {
    var count = 0;
    var buttons = this.props.children.map( (child: React.ReactElement) => (
      <div key={count += 1} className="text-center inline-block bg-slate-700 px-2 py-2 h-10 rounded-3xl mx-0.5 hover:translate-y-0.5 transition-transform	">
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

class Sidebar extends React.Component <{children: Array<React.ReactElement>}> {
  render() {
    var count = 0;
    var buttons = this.props.children.map((child: React.ReactElement) => (
      <div key={count += 1} className="block w-14 h-14 px-2 py-2 text-center bg-slate-700 rounded-md my-1 hover:translate-x-0.5 transition-transform	">
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

var scrollPos = 0;
function handleScroll(event: React.WheelEvent) {
  const main = document.getElementById('main');
  if (main == null) {
    return;
  }
  main.scrollTop += event.deltaY;
  var limit = Math.max( main.scrollHeight, main.offsetHeight, main.clientHeight, main.scrollHeight,main.offsetHeight );
  scrollPos = main.scrollTop / limit;
}

function updateScroll() {
  const main = document.getElementById('main');
  if (main == null) {
    return;
  }
  var limit = Math.max( main.scrollHeight, main.offsetHeight, main.clientHeight, main.scrollHeight,main.offsetHeight );
  scrollPos = main.scrollTop / limit;
}

function Render() {
  //init canvas
  //main loop
  useFrame((state, delta, xrFrame) => {
    state.camera.position.z = 5+(scrollPos*15);
  });
  return (<></>);
}

class Card extends React.Component <{children: Array<ReactElement>}> {
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

function generateStars(count: number) {
  var res = [];
  for (var i = 0; i < count; i++) {
    var x = ((Math.random() * 1000) % 500 ) - 250;
    var y = ((Math.random() * 1000) % 500 ) - 250;
    var z = ((Math.random() * 1000) % 200 ) - 100;
    res.push(<Star key={i} position={[x/10,y/10,z/10]}/>);
  }
  return res;
}

function clickHandle(e: any) {
  var main = document.getElementById('main');
  //get element with the same id as the href extracted from the element that called the event
  console.log(e.target.attributes.href);
  var href = e.target.attributes.href.nodeValue.split('/');
  var id = href[href.length-1];
  var element = document.getElementById(id);
  if (element == null || main == null) { //null check to make vscode shut up
    return;
  }
  //get the page position of the element so we can scroll to it
  var pos = element.getBoundingClientRect().top + main.scrollTop;
  main.scroll({
    top: pos, 
    left: 0, 
    behavior: 'smooth'
  });
}

//main
export default function Home() {
  var stars = generateStars(100);
  return (
    <div className="fixed bg-slate-950 top-0 bottom-0 left-0 right-0">
      <main onWheel={handleScroll} onScroll={updateScroll} id="main" className="py-20 fixed top-0 bottom-0 left-0 right-0 overflow-scroll">
        <div className="fixed top-0 bottom-0 left-0 right-0">
          <Canvas className="pointer-events-auto">
            <Render/>
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
          <Image width="10" height="10" className="w-10 h-10" src="/github.svg" alt="Github"></Image>
        </a>
        <a href="mailto:elihersha@gmail.com" target="_blank">
          <Image width="10" height="10" className="w-10 h-10" src="/email.svg" alt="Email"></Image>
        </a>
      </Sidebar>
    </div>
  )
}