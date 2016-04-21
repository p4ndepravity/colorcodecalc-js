
bands = []

function band_btns(){
  html_string = ''
  for(band in static_bands){
    if(bands.length<2){
      if(band != 'gold' && band != 'silver'){
        html_string += '<button class="btn btn-default btn-block band_btn" style="color: '+band+';" onclick="add_band($(this).text());">'+band+'</button>\n'
      }
    } else if(bands.length >= 3){
      if(band != 'black' && band != 'orange' && band != 'white'){
        html_string += '<button class="btn btn-default btn-block band_btn" style="color: '+band+';" onclick="add_band($(this).text());">'+band+'</button>\n'
      }
    } else {
      html_string += '<button class="btn btn-default btn-block band_btn" style="color: '+band+';" onclick="add_band($(this).text());">'+band+'</button>\n'
    }
  }
  return html_string
}

function add_band_btn(){
  if(bands.length<5){
    // creates the button for adding bands from the inside out
    dropdown_list_html = '<div class="dropdown-menu" aria-labelledby="add_band_btn"><div class="center-block">'+band_btns()+'</div></div>'
    add_band_btn_html = '<button class="btn btn-default" data-toggle="tooltip" data-placement="top" data-original-title="Add Band">+</button>'
    effect_span_html = '<span class="tooltip-class dropdown-toggle" data-toggle="dropdown" id="add_band_btn" aria-haspopup="true">'+add_band_btn_html+'</span>'
    dropdown_span_html = '<span class="dropdown">'+effect_span_html+dropdown_list_html+'</span>'
    return dropdown_span_html
  } else {
    return ''
  }
}

function show_bands(){
  html_string = ''
  for(band in bands){
    position = parseInt(band) + 1
    band = bands[band]
    if(position > 2 && position == bands.length){ html_string += '<li>&nbsp;</li>' }
    band_html = '<span class="tooltip-class"><span class="band-bar" style="color: '+band.color+';" data-toggle="tooltip" data-placement="top" data-original-title="'+band.color+'">|</span></span>'
    html_string += '<li>'+band_html+'</li>'
  }
  html_string = '<li><span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></li>'
                +html_string+add_band_btn()+
                '<li><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></li>'
  $('#band-list').html(html_string)
  return
}

function add_band(color){
  bands.push(static_bands[color])
  calculate_ohm_value_call()
  return
}

function remove_band(index){
  bands.splice(index, 1)
  calculate_ohm_value_call()
  return
}

function calculate_ohm_value_call(){
  colors = []
  for(band in bands){
    colors.push(bands[band].color)
  }
  CalculateOhmValue(colors[0], colors[1], colors[2], colors[3], colors[4])
  return
}

// calculates the resistance of a resistor in ohms
// based on the colors of the bands up to 5 bands
function CalculateOhmValue(bandAColor, bandBColor, bandCColor, bandDColor, bandFColor){
  resistance = 0
  min_resistance = 0
  max_resistance = 0

  if(bandAColor){
    a = static_bands[bandAColor]
    resistance = a.sig_figs
    if(bandBColor){
      b = static_bands[bandBColor]
      resistance = (resistance * 10) + b.sig_figs
      if(bandCColor){
        c = static_bands[bandCColor]
        resistance = resistance * c.multiplier
        if(bandDColor){
          d = static_bands[bandDColor]
          min_resistance = resistance * (1 - d.tolerance)
          max_resistance = resistance * (1 + d.tolerance)
          if(bandFColor){ // in the event of 5 bands, the arithmetic varies slightly
            f = static_bands[bandDColor]
            resistance = ((a.sig_figs*100)+(b.sig_figs*10)+c.sig_figs)*d.multiplier
            min_resistance = resistance * (1 - f.tolerance)
            max_resistance = resistance * (1 + f.tolerance)
          }
        }
      }
    }
  }

  $('#idealResistance').val(resistance)
  $('#minResistance').val(min_resistance)
  $('#maxResistance').val(max_resistance)
  show_bands()
  return
}

function reset(){
  bands = []
  calculate_ohm_value_call()
  return
}

$(document).ready(function(){
  
  $('.tooltip-class').tooltip({
    selector: '[data-toggle=tooltip]',
    container: 'body'
  })

  calculate_ohm_value_call()

})
