// import { h3ToGeoBoundary } from 'h3-js';
import { Card, TextField } from '@material-ui/core';
import { Polygon } from 'geojson';
import { h3GetResolution, h3ToGeo, h3ToGeoBoundary } from 'h3-js';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ReactMapboxGl, { GeoJSONLayer } from 'react-mapbox-gl';

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoiamFja2RyZWlsbHkiLCJhIjoiY2s2d2E3MG5qMDlsdTNubXZteXMwc2loNSJ9.C5X0kx26B6QDZibVZau9YQ'
});

export interface RootState {
  hexID: string;
  feature: Polygon;
  center: [number, number];
  resolution: number;
}

export interface RootProps {}

class Root extends React.Component<RootProps, RootState> {
  constructor(props: RootProps) {
    super(props);
    this.state = this.newState('87283472bffffff');
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  newState(hexID: string): RootState {
    const feature: Polygon = {
      type: 'Polygon',
      coordinates: [h3ToGeoBoundary(hexID, true)]
    };
    const _convert = h3ToGeo(hexID);
    const center: [number, number] = [_convert[1], _convert[0]];
    const resolution = h3GetResolution(hexID);
    return { hexID, feature, center, resolution };
  }

  handleChange(event: any) {
    this.setState({ hexID: event.target.value });
  }

  handleSubmit(event: any) {
    const { feature, center, resolution } = this.newState(this.state.hexID);
    this.setState({ feature, center, resolution });
    event.preventDefault();
  }

  render() {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          position: 'relative'
        }}
      >
        <Card
          style={{
            margin: '12px',
            position: 'absolute',
            padding: '10px',
            zIndex: 2
          }}
          elevation={10}
        >
          <form onSubmit={this.handleSubmit}>
            <TextField
              id="h3-id"
              label="H3 Hex ID"
              onChange={this.handleChange}
              value={this.state.hexID}
            ></TextField>
          </form>
          <div id="details" style={{
            marginTop: '10px'
          }}>
            Center:{' '}
            {`${this.state.center[1].toFixed(
              4
            )}, ${this.state.center[0].toFixed(4)}`}
            <br />
            Resolution: {this.state.resolution}
          </div>
        </Card>
        <Map
          style={'mapbox://styles/mapbox/light-v9'}
          center={this.state.center}
          movingMethod="jumpTo"
          zoom={[this.state.resolution + 5]}
          containerStyle={{
            height: '100%',
            width: '100%',
            flex: 1
          }}
        >
          <GeoJSONLayer
            linePaint={{
              'line-color': 'red',
              'line-width': 10
            }}
            data={this.state.feature}
          />
        </Map>
      </div>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));
