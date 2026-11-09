import React from 'react';

export default class ErrorBoundary extends React.Component{
  state={error:null};
  static getDerivedStateFromError(error){return {error}}
  componentDidCatch(error,info){console.error('Alberto render failure',error,info)}
  render(){if(this.state.error)return <main className="render-error"><h1>The display could not load.</h1><p>Refresh the page to try again.</p>{import.meta.env.DEV&&<pre>{String(this.state.error)}</pre>}</main>;return this.props.children}
}
