import React from "react";
import ReactDOM from "react-dom";
import { Navbar, Nav, NavItem, NavDropdown, Form, FormControl, Button, Image } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import * as d3 from 'd3'
import 'bootstrap/dist/css/bootstrap.css';
import gopherimg from "./images/gopher-blue.png"
import './styles.css'

function getData() {
  let numItems = 20
  let data = []
  for(let i=0; i<numItems; i++) {
    data.push({
      x: i,
      y: Math.random(),
    })
  }
  return data
}

class Chart extends React.Component {
  constructor(props) {
    super(props)
    this.totalwidth = 300
    this.totalheight = 300	  
    this.margin = {top: 10, right: 10, bottom: 25, left: 25}
    this.width = this.totalwidth - this.margin.left - this.margin.right // Use the window's width 
    this.height = this.totalheight - this.margin.top - this.margin.bottom; // Use the window's height	
    
    this.state = {
      data: getData()
    }
    
    //this.handleClick = this.handleClick.bind(this)
    //this.updateStyleAndAttrs = this.updateChart.bind(this)
  }
  
  handleClick() {
    this.setState({
      data: getData()
    })
  }
  
  componentDidMount() {
    this.updateChart()
  }

  componentDidUpdate() {
    this.updateChart()
  }

  
  updateChart() {
    let xScale = d3.scaleLinear().domain([0, this.state.data.length]).range([0, this.width])
    let yScale = d3.scaleLinear().domain([0, 1]).range([0, this.height])

    var line = d3.line()
        .x((d, i) => { return xScale(d.x); }) // set the x values for the line generator
        .y((d) => { return yScale(d.y); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    let svg = d3.select(this.svgEl).append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
 
    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", this.width)
        .attr("height", this.height)
	.attr("fill", "#044B94") 
	.attr("fill-opacity", "0.2")
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + 0 + "," + (this.height) + ")")
    .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

// 4. Call the y axis in a group tag
svg.append("g")
    .attr("class", "y axis")
     .attr("transform", "translate(" + 0 + "," + (0) + ")")
 
  .call(d3.axisLeft(yScale)); 

// 9. Append the path, bind the data, and call the line generator 
svg.append("path")
    .datum(this.state.data) // 10. Binds data to the line 
    .attr("class", "line") // Assign a class for styling 
    .attr("d", line); // 11. Calls the line generator 

// 12. Appends a circle for each datapoint 
svg.selectAll(".dot")
    .data(this.state.data)
  .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d, i) { return xScale(d.x) })
    .attr("cy", function(d) { return yScale(d.y) })
    .attr("r", 4);

 var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", this.height);

    focus.append("circle")
        .attr("r", 7.5);

    focus.append("text")
        .attr("x", 15)
      	.attr("dy", ".31em");


    var bisectDate = d3.bisector(function(d) { return d.x; }).left;

    var mousemove = () => {
	  var overlay = svg.select('.overlay').node();
          var x0 = xScale.invert(d3.mouse(overlay)[0]),
	  i = bisectDate(this.state.data, x0, 1),
          d0 = this.state.data[i - 1],
          d1 = this.state.data[i],
          d = x0 - d0.x > d1.x - x0 ? d1 : d0;
      focus.attr("transform", "translate(" + (xScale(d.x)) + "," + (yScale(d.y)) + ")");
      focus.select("text").text(function() { return d3.mouse(overlay)[0]; });
      focus.select(".x-hover-line").attr("y2", this.height - yScale(d.y));
    }

  }
  
  render() {
        return <svg height = "100%" width = "100%" preserveAspectRatio="none" viewBox="0 0 300 300" ref={el => this.svgEl = el} />
  }
}

function Index() {
return <ul class="grid">
  {Array.from({length: 10}, (x,i) => <li key={i}><Chart /></li>)}
</ul>
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

class Header extends React.Component {
  render() {
    return (
<div>
<Navbar bg="dark" variant="dark" expand="lg">
  <Navbar.Brand href="#home"><Image src={gopherimg} width="30" fluid/>Golang Performance</Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
      <Nav.Link><Link to="/">Home</Link></Nav.Link>
      <Nav.Link><Link to="/about/">About</Link></Nav.Link>
      <NavDropdown title="Dropdown" id="basic-nav-dropdown">
        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
      </NavDropdown>
    </Nav>
    <Form inline>
      <FormControl type="text" placeholder="Search" className="mr-sm-2" />
      <Button variant="outline-success">Search</Button>
    </Form>
  </Navbar.Collapse>
</Navbar>
</div>
    );
  }
}


class Welcome extends React.Component {
render() {
    return (
      <div>
	    <Router>
        <Header/>
        <Route path="/" exact component={Index} />
        <Route path="/about/" component={About} />
        <Route path="/users/" component={Users} />
      </Router>
	    </div>
    );
  }
}



ReactDOM.render(<Welcome />, document.getElementById("root"));
