import React from 'react';
import './Preview.css';

class ComponentToPrintV1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editableMessage: this.props.message,
    };
  }
  
  
  handleChange = (event) => {
    this.setState({ editableMessage: event.target.value });
    if (this.props.messageChange) {
      this.props.messageChange(event.target.value);
    }
  };
  
  render() {
    return (
      <div className={'cardPrintComponent'} style={{
        height: '3.5in', // Outer box height
        width: '2.25in', // Outer box width
        display: 'flex',
        justifyContent: 'center', // Align text container horizontally in the middle
        alignItems: 'center', // Align text container vertically in the middle
        border: this.props.isPrintMode ? 'none' : '1px solid black', // Optional: adds a border to visualize the container
        position: 'relative', // Needed for absolute positioning of inner content
        margin: 0,
        padding: 0,
      }}>
        <div style={{
          position: 'absolute',
          top: '0.20in', // Half of the total height reduction to center the content
          left: '0.4in', // Half of the total width reduction to center the content
          height: '3.0in', // Reduced height (2.25in - 0.6in)
          width: '1.65in', // Reduced width (3.5in - 0.5in)
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center', // Align text container vertically in the middle for flex-direction: column
          border: this.props.isPrintMode ? 'none' : '1px solid black',
        }}>
          <textarea
            value={this.state.editableMessage}
            onChange={this.handleChange}
            style={{
              textAlign: 'center',
              verticalAlign: 'middle',
              width: '3.0in',
              height: '1.65in',
              transform: 'rotate(-90deg)',
              transformOrigin: 'center center',
              backgroundColor: 'transparent',
              resize: 'none',
              border: 'none',
              fontSize: `${this.props.fz}px`,
              lineHeight: `${this.props.lineHeight}`,
              overflow: 'hidden',
              padding: 0,
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordSpacing: '0.0em',
              fontFamily: 'arial',
            }}
          />
        </div>
      </div>
    );
  }
}

export default ComponentToPrintV1;