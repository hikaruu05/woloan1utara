<?php
/**
 * Plugin Name: Woloan Portal Content
 * Description: Simple staff editor and read-only catalog API for the Woloan 1 Utara React portal.
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit;
}

final class Woloan_Portal_Content {
    private const HOUSE = 'woloan_house';
    private const STORE = 'woloan_store';

    public function __construct() {
        add_action('init', [$this, 'register_content_types']);
        add_action('after_setup_theme', [$this, 'enable_featured_images']);
        add_action('add_meta_boxes', [$this, 'register_meta_boxes']);
        add_action('save_post', [$this, 'save_meta'], 10, 2);
        add_action('rest_api_init', [$this, 'register_catalog_route']);
        add_filter('allowed_http_origins', [$this, 'allow_portal_origin']);
        add_action('admin_menu', [$this, 'register_settings_page']);
        add_action('admin_init', [$this, 'register_settings']);
    }

    public function enable_featured_images(): void {
        add_theme_support('post-thumbnails', [self::HOUSE, self::STORE]);
    }

    public function allow_portal_origin(array $origins): array {
        $origin = get_option('woloan_portal_origin', '');
        if ($origin && !in_array($origin, $origins, true)) $origins[] = $origin;
        return $origins;
    }

    public function register_settings_page(): void {
        add_options_page('Woloan Portal', 'Woloan Portal', 'manage_options', 'woloan-portal', [$this, 'render_settings_page']);
    }

    public function register_settings(): void {
        register_setting('woloan_portal', 'woloan_portal_origin', [
            'type' => 'string',
            'sanitize_callback' => [$this, 'sanitize_portal_origin'],
            'default' => '',
        ]);
        add_settings_section('woloan_connection', 'Koneksi portal publik', function (): void {
            echo '<p>Masukkan alamat utama portal publik. Gunakan alamat HTTPS tanpa garis miring atau halaman tambahan.</p>';
        }, 'woloan-portal');
        add_settings_field('woloan_portal_origin', 'Alamat portal publik', [$this, 'render_origin_field'], 'woloan-portal', 'woloan_connection');
    }

    public function sanitize_portal_origin($value): string {
        $value = is_string($value) ? trim($value) : '';
        if ($value === '') return '';
        $parts = wp_parse_url(esc_url_raw($value));
        if (!$parts || empty($parts['scheme']) || empty($parts['host']) || !in_array(strtolower($parts['scheme']), ['https', 'http'], true)) {
            add_settings_error('woloan_portal_origin', 'invalid_origin', 'Masukkan alamat lengkap, misalnya https://portal.example.id.');
            return get_option('woloan_portal_origin', '');
        }
        $origin = strtolower($parts['scheme']) . '://' . strtolower($parts['host']);
        if (!empty($parts['port'])) $origin .= ':' . (int) $parts['port'];
        return $origin;
    }

    public function render_origin_field(): void {
        printf(
            '<input class="regular-text" type="url" name="woloan_portal_origin" value="%s" placeholder="https://portal.example.id">',
            esc_attr(get_option('woloan_portal_origin', ''))
        );
    }

    public function render_settings_page(): void {
        if (!current_user_can('manage_options')) return;
        echo '<div class="wrap"><h1>Woloan Portal</h1><form method="post" action="options.php">';
        settings_fields('woloan_portal');
        do_settings_sections('woloan-portal');
        submit_button('Simpan pengaturan');
        echo '</form></div>';
    }

    public function register_content_types(): void {
        register_post_type(self::HOUSE, [
            'labels' => [
                'name' => 'Rumah Panggung',
                'singular_name' => 'Rumah Panggung',
                'add_new_item' => 'Tambah Rumah Panggung',
                'edit_item' => 'Edit Rumah Panggung',
                'search_items' => 'Cari Rumah Panggung',
            ],
            'public' => false,
            'show_ui' => true,
            'show_in_rest' => false,
            'menu_icon' => 'dashicons-admin-home',
            'supports' => ['title', 'editor', 'thumbnail'],
            'capability_type' => 'post',
            'map_meta_cap' => true,
        ]);

        register_post_type(self::STORE, [
            'labels' => [
                'name' => 'Toko & UMKM',
                'singular_name' => 'Toko / UMKM',
                'add_new_item' => 'Tambah Toko / UMKM',
                'edit_item' => 'Edit Toko / UMKM',
                'search_items' => 'Cari Toko / UMKM',
            ],
            'public' => false,
            'show_ui' => true,
            'show_in_rest' => false,
            'menu_icon' => 'dashicons-store',
            'supports' => ['title', 'editor', 'thumbnail'],
            'capability_type' => 'post',
            'map_meta_cap' => true,
        ]);
    }

    private function fields_for(string $post_type): array {
        if ($post_type === self::HOUSE) {
            return [
                'type' => ['label' => 'Jenis rumah', 'type' => 'select', 'options' => [
                    'tradisional' => 'Tradisional Walewangko', 'dua_lantai' => 'Villa 2 Lantai',
                    'minimalis' => 'Minimalis Tropis', 'villa' => 'Cottage / Resor', 'gazebo' => 'Gazebo & Bale',
                ]],
                'dimensions' => ['label' => 'Ukuran', 'placeholder' => 'Contoh: 8 x 10 Meter'],
                'wood_types' => ['label' => 'Jenis kayu', 'placeholder' => 'Pisahkan dengan koma'],
                'bedrooms' => ['label' => 'Jumlah kamar tidur', 'type' => 'number'],
                'bathrooms' => ['label' => 'Jumlah kamar mandi', 'type' => 'number'],
                'floors' => ['label' => 'Jumlah lantai', 'type' => 'number'],
                'price_estimated' => ['label' => 'Perkiraan harga', 'placeholder' => 'Contoh: Rp 150.000.000 - Rp 180.000.000'],
                'min_budget' => ['label' => 'Harga mulai (angka rupiah)', 'type' => 'number'],
                'craftsman_name' => ['label' => 'Nama bengkel / pengrajin'],
                'craftsman_phone' => ['label' => 'Nomor WhatsApp'],
                'craftsman_address' => ['label' => 'Alamat bengkel'],
                'maps_url' => ['label' => 'Tautan Google Maps', 'type' => 'url'],
                'features' => ['label' => 'Keunggulan', 'type' => 'textarea', 'help' => 'Satu keunggulan per baris.'],
                'custom_allowed' => ['label' => 'Menerima pesanan khusus', 'type' => 'checkbox'],
            ];
        }

        return [
            'owner_name' => ['label' => 'Nama pemilik'],
            'category' => ['label' => 'Kategori usaha', 'type' => 'select', 'options' => [
                'kerajinan' => 'Kerajinan', 'kuliner' => 'Kuliner', 'pertanian' => 'Pertanian',
                'jasa' => 'Jasa', 'lainnya' => 'Lainnya',
            ]],
            'phone' => ['label' => 'Nomor WhatsApp'],
            'address' => ['label' => 'Alamat'],
            'maps_url' => ['label' => 'Tautan Google Maps', 'type' => 'url'],
            'badge' => ['label' => 'Label unggulan'],
            'products' => ['label' => 'Daftar produk', 'type' => 'textarea', 'help' => 'Satu produk per baris: nama | harga | harga angka | satuan | deskripsi | tautan foto.'],
        ];
    }

    public function register_meta_boxes(): void {
        add_meta_box('woloan_details', 'Informasi listing', [$this, 'render_meta_box'], self::HOUSE, 'normal', 'high');
        add_meta_box('woloan_details', 'Informasi usaha', [$this, 'render_meta_box'], self::STORE, 'normal', 'high');
        add_meta_box('woloan_publish_help', 'Tampilkan di portal', [$this, 'render_publish_help'], [self::HOUSE, self::STORE], 'side', 'high');
    }

    public function render_publish_help(WP_Post $post): void {
        echo '<p>Listing berstatus <strong>Terbit</strong> akan muncul di portal publik. Simpan sebagai <strong>Draf</strong> untuk menyiapkannya sebelum ditampilkan.</p>';
        echo '<p>Gunakan tombol <strong>Atur gambar unggulan</strong> untuk mengunggah foto utama listing.</p>';
    }

    public function render_meta_box(WP_Post $post): void {
        wp_nonce_field('woloan_save_listing', 'woloan_listing_nonce');
        echo '<p>Isi informasi berikut. Judul, deskripsi, dan gambar utama diisi pada editor WordPress di atas/bawah panel ini.</p>';
        echo '<div class="woloan-fields" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px">';
        foreach ($this->fields_for($post->post_type) as $key => $field) {
            $value = get_post_meta($post->ID, '_woloan_' . $key, true);
            $type = $field['type'] ?? 'text';
            echo '<label style="display:block;font-weight:600">' . esc_html($field['label']) . '<br>';
            if ($type === 'textarea') {
                echo '<textarea style="width:100%;min-height:90px" name="woloan_meta[' . esc_attr($key) . ']">' . esc_textarea((string) $value) . '</textarea>';
            } elseif ($type === 'select') {
                echo '<select style="width:100%" name="woloan_meta[' . esc_attr($key) . ']">';
                foreach ($field['options'] as $option => $label) {
                    echo '<option value="' . esc_attr($option) . '" ' . selected($value, $option, false) . '>' . esc_html($label) . '</option>';
                }
                echo '</select>';
            } elseif ($type === 'checkbox') {
                echo '<input type="checkbox" name="woloan_meta[' . esc_attr($key) . ']" value="1" ' . checked($value, '1', false) . '> Ya';
            } else {
                echo '<input style="width:100%" type="' . esc_attr($type) . '" name="woloan_meta[' . esc_attr($key) . ']" value="' . esc_attr((string) $value) . '" placeholder="' . esc_attr($field['placeholder'] ?? '') . '">';
            }
            if (!empty($field['help'])) {
                echo '<span style="display:block;font-weight:400;color:#646970">' . esc_html($field['help']) . '</span>';
            }
            echo '</label>';
        }
        echo '</div>';
    }

    public function save_meta(int $post_id, WP_Post $post): void {
        if (!isset($_POST['woloan_listing_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['woloan_listing_nonce'])), 'woloan_save_listing')) {
            return;
        }
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        if (!current_user_can('edit_post', $post_id)) return;
        if (!in_array($post->post_type, [self::HOUSE, self::STORE], true)) return;

        $submitted = isset($_POST['woloan_meta']) && is_array($_POST['woloan_meta']) ? wp_unslash($_POST['woloan_meta']) : [];
        foreach ($this->fields_for($post->post_type) as $key => $field) {
            if (($field['type'] ?? '') === 'checkbox') {
                update_post_meta($post_id, '_woloan_' . $key, isset($submitted[$key]) ? '1' : '0');
            } elseif (isset($submitted[$key])) {
                $value = is_array($submitted[$key]) ? '' : (string) $submitted[$key];
                if (($field['type'] ?? '') === 'textarea') $value = sanitize_textarea_field($value);
                elseif (($field['type'] ?? '') === 'url') $value = esc_url_raw($value);
                elseif (($field['type'] ?? '') === 'number') $value = (string) absint($value);
                else $value = sanitize_text_field($value);
                update_post_meta($post_id, '_woloan_' . $key, $value);
            }
        }
    }

    public function register_catalog_route(): void {
        register_rest_route('woloan/v1', '/catalog', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [$this, 'get_catalog'],
            'permission_callback' => '__return_true',
        ]);
    }

    private function listing_posts(string $post_type): array {
        return get_posts([
            'post_type' => $post_type,
            'post_status' => 'publish',
            'numberposts' => -1,
            'orderby' => 'date',
            'order' => 'DESC',
        ]);
    }

    private function meta_value(WP_Post $post, string $key, $default = '') {
        $value = get_post_meta($post->ID, '_woloan_' . $key, true);
        return $value === '' ? $default : $value;
    }

    private function image_url(WP_Post $post): string {
        $url = get_the_post_thumbnail_url($post, 'large');
        return $url ? $url : '';
    }

    public function get_catalog(): WP_REST_Response {
        $houses = [];
        foreach ($this->listing_posts(self::HOUSE) as $post) {
            $wood_types = array_filter(array_map('trim', explode(',', $this->meta_value($post, 'wood_types'))));
            $features = array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', $this->meta_value($post, 'features'))));
            $image = $this->image_url($post);
            $houses[] = [
                'id' => (string) $post->ID,
                'title' => get_the_title($post),
                'type' => $this->meta_value($post, 'type', 'tradisional'),
                'dimensions' => $this->meta_value($post, 'dimensions'),
                'woodTypes' => array_values($wood_types),
                'bedrooms' => (int) $this->meta_value($post, 'bedrooms', 0),
                'bathrooms' => (int) $this->meta_value($post, 'bathrooms', 0),
                'floors' => (int) $this->meta_value($post, 'floors', 1),
                'priceEstimated' => $this->meta_value($post, 'price_estimated'),
                'minBudget' => (int) $this->meta_value($post, 'min_budget', 0),
                'craftsmanName' => $this->meta_value($post, 'craftsman_name'),
                'craftsmanPhone' => $this->meta_value($post, 'craftsman_phone'),
                'craftsmanAddress' => $this->meta_value($post, 'craftsman_address'),
                'mapsUrl' => $this->meta_value($post, 'maps_url') ?: null,
                'description' => wp_strip_all_tags(apply_filters('the_content', $post->post_content)),
                'features' => array_values($features),
                'imageUrl' => $image,
                'galleryUrls' => $image ? [$image] : [],
                'isVerified' => true,
                'isCustomAllowed' => $this->meta_value($post, 'custom_allowed') === '1',
                'createdAt' => get_the_date('Y-m-d', $post),
            ];
        }

        $stores = [];
        foreach ($this->listing_posts(self::STORE) as $post) {
            $products = [];
            $rows = preg_split('/\r\n|\r|\n/', trim($this->meta_value($post, 'products')));
            foreach ($rows as $index => $row) {
                $parts = array_map('trim', explode('|', $row));
                if (empty($parts[0])) continue;
                $products[] = [
                    'id' => $post->ID . '-product-' . $index,
                    'name' => $parts[0],
                    'price' => $parts[1] ?? 'Hubungi Penjual',
                    'priceNum' => isset($parts[2]) ? (int) $parts[2] : 0,
                    'unit' => $parts[3] ?? '',
                    'description' => $parts[4] ?? '',
                    'imageUrl' => $parts[5] ?? $this->image_url($post),
                ];
            }
            $stores[] = [
                'id' => (string) $post->ID,
                'name' => get_the_title($post),
                'ownerName' => $this->meta_value($post, 'owner_name'),
                'category' => $this->meta_value($post, 'category', 'lainnya'),
                'phone' => $this->meta_value($post, 'phone'),
                'address' => $this->meta_value($post, 'address'),
                'mapsUrl' => $this->meta_value($post, 'maps_url') ?: null,
                'description' => wp_strip_all_tags(apply_filters('the_content', $post->post_content)),
                'imageUrl' => $this->image_url($post),
                'badge' => $this->meta_value($post, 'badge'),
                'isVerified' => true,
                'createdAt' => get_the_date('Y-m-d', $post),
                'products' => $products,
            ];
        }

        return rest_ensure_response(['houses' => $houses, 'umkmStores' => $stores]);
    }
}

new Woloan_Portal_Content();
