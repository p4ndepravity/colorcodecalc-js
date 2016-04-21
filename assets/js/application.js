
bands = []

function band_btns(){
  html_string = ''
  for(band in static_bands){
    if(bands.length<2){
      if(band != 'gold' && band != 'silver'){
        html_string += '<li><span class="btn btn-default btn-block band_btn" style="color: '+band+';" onclick="add_band($(this).text());">'+band+'</span></li>\n'
      }
    } else if(bands.length == 3){
      if(band != 'black' && band != 'orange' && band != 'white'){
        html_string += '<li><span class="btn btn-default btn-block band_btn" style="color: '+band+';" onclick="add_band($(this).text());">'+band+'</span></li>\n'
      }
    } else {
      html_string += '<li><span class="btn btn-default btn-block band_btn" style="color: '+band+';" onclick="add_band($(this).text());">'+band+'</span></li>\n'
    }
  }
  return html_string
}

function add_band_btn(){
  if(bands.length<4){
    html_string = '<span class="dropdown"><span class="tooltip-class dropdown-toggle" data-toggle="dropdown" id="add_band_btn" aria-haspopup="true"><button class="btn btn-default" data-toggle="tooltip" data-placement="top" data-original-title="Add Band">+</button></span><ul class="dropdown-menu" aria-labelledby="add_band_btn">'+band_btns()+'</ul></span>'
    return html_string
  } else {
    return ''
  }
}

function show_bands(){
  html_string = ''
  for(band in bands){
    band = bands[band]
    band_html = '<span class="tooltip-class"><span style="color: '+band.color+';" data-toggle="tooltip" data-placement="top" data-original-title="'+band.color+'">|</span></span>'
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
  if(bands.length == 4){
    CalculateOhmValue(bands[0].color, bands[1].color, bands[2].color, bands[3].color);
  } else {
    show_bands()
  }
  return
}

function remove_band(index){
  bands.splice(index, 1)
  show_bands()
  if(bands.length == 4){
    CalculateOhmValue(bands[0].color, bands[1].color, bands[2].color, bands[3].color)
  } else {
    show_bands()
  }
  return
}

function CalculateOhmValue(bandAColor, bandBColor, bandCColor, bandDColor){
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
  CalculateOhmValue()
  return
}

$(document).ready(function(){
  
  $('.tooltip-class').tooltip({
    selector: '[data-toggle=tooltip]',
    container: 'body'
  })

})
