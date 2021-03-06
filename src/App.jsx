import React, { useState, useEffect } from 'react';
import './App.css';

import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg'
const ffmpeg = createFFmpeg({log:true});

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  }, [])

  const convertToGift = async () => {
    //tulis ke memori
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

    //Run ffmpeg command
    await ffmpeg.run('-i', 'test.mp4', '-t','2.5', '-ss', '2.0', '-f', 'gif', 'out.gif');

    //baca hasil
    const data = ffmpeg.FS('readFile', 'out.gif');

    //create a URL
    const url = URL.createObjectURL(new Blob([data.buffer], {type: 'image/gif'}));
    setGif(url)
  }
  

  return ready ? (
    <div className="App">
      {video && <video 
                controls 
                width="250"
                src={URL.createObjectURL(video)}>

    </video>}
    <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))}/>

    <h3>result</h3>
    <button onClick={convertToGift}>convert</button>
    {gif && <img src={gif} width='250' />}
    </div>
  ) : (<p>Loading...</p>);
}

export default App;
