import React, { useEffect, useState } from 'react';

export default function App() {
  const [apiHello, setApiHello] = useState('...');
  const [dbHello, setDbHello] = useState('...');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    fetch('/api/hello').then(r=>r.json()).then(d=>setApiHello(d.message));
    fetch('/api/db').then(r=>r.json()).then(d=>setDbHello(d.message));
    refresh();
  }, []);

  function refresh(){
    fetch('/api/messages').then(r=>r.json()).then(d=>setMessages(d));
  }

  function create(){
    fetch('/api/messages', {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({text})})
      .then(()=>{setText(''); refresh();});
  }

  function update(id){
    const newText = prompt('New text?');
    if(!newText) return;
    fetch(`/api/messages/${id}`, {method:'PUT', headers:{'content-type':'application/json'}, body: JSON.stringify({text:newText})})
      .then(()=>refresh());
  }

  return (
    React.createElement('div', {style:{fontFamily:'Arial', padding:20}},
      React.createElement('h1', null, 'Demo App'),
      React.createElement('p', null, 'Frontend says: Hello World from frontend'),
      React.createElement('p', null, `Backend says: ${apiHello}`),
      React.createElement('p', null, `Database says: ${dbHello}`),
      React.createElement('hr'),
      React.createElement('h2', null, 'Messages (simple CRUD)'),
      React.createElement('div', null,
        React.createElement('input', {value:text, onChange:e=>setText(e.target.value), placeholder:'message'}),
        React.createElement('button', {onClick:create}, 'Create')
      ),
      React.createElement('ul', null, messages.map(m=>React.createElement('li', {key:m.id},
        `${m.id}: ${m.text} `,
        React.createElement('button', {onClick:()=>update(m.id)}, 'Edit')
      )))
    )
  )
}
