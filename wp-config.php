<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'staff' );

/** MySQL database username */
define( 'DB_USER', 'root' );

/** MySQL database password */
define( 'DB_PASSWORD', '' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '=NoQ9i^gWz[bdEWm/97r9W[t11bGK:>DA5h-&{IH|c>5DaJ&$Z^,hgZ?O?mRu<9U' );
define( 'SECURE_AUTH_KEY',  '.zd:Xf=iA2@S 8<I!oOfJ*pt =JkGl7 5@>Hs}<Lt=WpzD^b=#DU[[$8V,V%~%VY' );
define( 'LOGGED_IN_KEY',    ')?~)j~2nO5aa>t0Ql`_oH}~S$K RI9b.o]z]Itm7#a1&kz`qa+(dzfNe>SN`HDfI' );
define( 'NONCE_KEY',        ' q3Ya+vylUjp7]%}!=hK4m4mljr}nh905+sfxo;Z1`BwqsvSpo0%vK!K18({`cSi' );
define( 'AUTH_SALT',        'h-FqX%IEsoqWjVmF37;Tr_pyvebJ}sXmVJ-lme[ew=!#R_,M$p3;q.%m7FBuJ-P?' );
define( 'SECURE_AUTH_SALT', '@gZV*S2[*wD,Aeh<pe  Pxk[V#s/Zvwn[?Ey$^(gl}%zCJf%$1f+7<]^,XwPhk7~' );
define( 'LOGGED_IN_SALT',   '%Ag<N-.bA1jElxke>#0x-B~0Qw-d,JWxX!.&R)_e/!5QJ^gHgPAFRZ$5SvG/(7>c' );
define( 'NONCE_SALT',       'Z?DuM8IS_N9=@:1VgdlRQeWs8R/p>o8E~ %qOJ*/U[/w`Yy.`|g_&v(^m:(e{2qm' );

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';




/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) )
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
