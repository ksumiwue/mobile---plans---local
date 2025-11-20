<?php
if (!defined('ABSPATH')) exit;

function mobile_plans_shortcode_simple($atts) {
    $atts = shortcode_atts(['height' => '800', 'width' => '100%'], $atts);
    
    $app_urls = [
        get_template_directory_uri() . '/mobile-plans-web/index-new.html',
        get_stylesheet_directory_uri() . '/mobile-plans-web/index-new.html',
        site_url() . '/wp-content/themes/' . get_template() . '/mobile-plans-web/index-new.html'
    ];
    
    $app_url = '';
    foreach ($app_urls as $url) {
        $path = str_replace(site_url(), ABSPATH, $url);
        if (file_exists($path)) {
            $app_url = $url;
            break;
        }
    }
    
    if (empty($app_url)) {
        return '<div style="background:#ffebee;color:#c62828;padding:20px;border-radius:8px;text-align:center;"><h4>Mobile Plans no encontrado</h4></div>';
    }
    
    $iframe_id = 'mobile-plans-' . uniqid();
    
    ob_start();
    ?>
    <div class="mobile-plans-wrapper" id="wrapper-<?php echo $iframe_id; ?>">
        <iframe id="<?php echo $iframe_id; ?>" src="<?php echo $app_url; ?>?wp_integration=1" style="width:<?php echo $atts['width']; ?>;height:<?php echo $atts['height']; ?>px;border:none;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.1);background:white;display:block;max-width:100%;" frameborder="0" scrolling="no"></iframe>
    </div>
    <style>.mobile-plans-wrapper{margin:20px 0;position:relative}.mobile-plans-wrapper iframe{transition:height .3s ease}@media (max-width:768px){.mobile-plans-wrapper iframe{min-height:600px}}</style>
    <script>
    (function(){var i=document.getElementById('<?php echo $iframe_id; ?>'),b=null;function c(){if(b)return b;b=document.createElement('div');b.innerHTML='Comparar (0)';b.style.cssText='position:fixed!important;top:50%!important;right:20px!important;transform:translateY(-50%)!important;background:linear-gradient(135deg,#4A90E2,#357ABD)!important;color:white!important;padding:.8rem 1rem!important;border-radius:50px!important;box-shadow:0 6px 20px rgba(74,144,226,.4)!important;cursor:pointer!important;font-weight:600!important;font-size:.85rem!important;z-index:99999!important;transition:all .3s ease!important;border:2px solid rgba(255,255,255,.2)!important;min-width:130px!important;text-align:center!important;display:none!important;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif!important;user-select:none!important;pointer-events:auto!important';b.addEventListener('click',function(){if(i&&i.contentWindow)i.contentWindow.postMessage({tipo:'navegarAComparacion'},'*')});b.addEventListener('mouseenter',function(){b.style.transform='translateY(-50%) translateX(-5px) scale(1.05)';b.style.boxShadow='0 12px 35px rgba(74,144,226,.6)'});b.addEventListener('mouseleave',function(){b.style.transform='translateY(-50%)';b.style.boxShadow='0 8px 25px rgba(74,144,226,.4)'});var m=window.matchMedia('(max-width:768px)');function h(e){if(e.matches){b.style.display='none!important';b.style.visibility='hidden!important'}else{b.style.visibility='visible'}}m.addListener(h);h(m);document.body.appendChild(b);console.log('WP: Boton creado');return b}function u(s,n){console.log('WP: Actualizar boton',{mostrar:s,contador:n});var t=c();if(s&&n>0){t.style.display='block';t.innerHTML='Comparar ('+n+')';console.log('WP: Boton mostrado:',n)}else{t.style.display='none'}}window.addEventListener('message',function(e){console.log('WP: Mensaje',{tipo:e.data&&e.data.tipo,esIframe:e.source===i.contentWindow});if(e.source===i.contentWindow){if(typeof e.data==='object'&&e.data.tipo==='ajustarAltura'){i.style.height=e.data.altura+'px'}if(typeof e.data==='object'&&e.data.tipo==='updateStickyButton'){u(e.data.mostrar,e.data.contador)}}});i.addEventListener('load',function(){console.log('WP: Iframe cargado');setTimeout(function(){i.contentWindow.postMessage({tipo:'stickyButtonCreated'},'*')},500)});setInterval(function(){if(i&&i.contentWindow)i.contentWindow.postMessage({tipo:'solicitarAltura'},'*')},1000);window.addEventListener('beforeunload',function(){if(b&&b.parentElement)b.parentElement.removeChild(b)});console.log('WP: Script configurado')})();
    </script>
    <?php
    return ob_get_clean();
}

add_shortcode('mobile_plans', 'mobile_plans_shortcode_simple');

add_action('elementor/widgets/widgets_registered', function() {
    if (class_exists('\\Elementor\\Widget_Base')) {
        class Mobile_Plans_Simple_Widget extends \Elementor\Widget_Base {
            public function get_name() { return 'mobile-plans-simple'; }
            public function get_title() { return 'Mobile Plans'; }
            public function get_icon() { return 'eicon-posts-grid'; }
            public function get_categories() { return ['general']; }
            protected function _register_controls() {
                $this->start_controls_section('simple_section', ['label' => 'Configuracion', 'tab' => \Elementor\Controls_Manager::TAB_CONTENT]);
                $this->add_control('height', ['label' => 'Altura Inicial', 'type' => \Elementor\Controls_Manager::SLIDER, 'size_units' => ['px'], 'range' => ['px' => ['min' => 400, 'max' => 1200, 'step' => 50]], 'default' => ['unit' => 'px', 'size' => 800]]);
                $this->end_controls_section();
            }
            protected function render() {
                $settings = $this->get_settings_for_display();
                echo mobile_plans_shortcode_simple(['height' => $settings['height']['size'] ?? 800]);
            }
        }
        \Elementor\Plugin::instance()->widgets_manager->register_widget_type(new Mobile_Plans_Simple_Widget());
    }
});