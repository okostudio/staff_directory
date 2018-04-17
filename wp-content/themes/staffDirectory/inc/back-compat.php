<?php
/**
 * Staff Directory back compat functionality
 *
 * Prevents Staff Directory from running on WordPress versions prior to 4.7,
 * since this theme is not meant to be backward compatible beyond that and
 * relies on many newer functions and markup changes introduced in 4.7.
 *
 * @package WordPress
 * @subpackage Twenty_Seventeen
 * @since Staff Directory 1.0
 */

/**
 * Prevent switching to Staff Directory on old versions of WordPress.
 *
 * Switches to the default theme.
 *
 * @since Staff Directory 1.0
 */
function staffDirectory_switch_theme() {
	switch_theme( WP_DEFAULT_THEME );
	unset( $_GET['activated'] );
	add_action( 'admin_notices', 'staffDirectory_upgrade_notice' );
}
add_action( 'after_switch_theme', 'staffDirectory_switch_theme' );

/**
 * Adds a message for unsuccessful theme switch.
 *
 * Prints an update nag after an unsuccessful attempt to switch to
 * Staff Directory on WordPress versions prior to 4.7.
 *
 * @since Staff Directory 1.0
 *
 * @global string $wp_version WordPress version.
 */
function staffDirectory_upgrade_notice() {
	$message = sprintf( __( 'Staff Directory requires at least WordPress version 4.7. You are running version %s. Please upgrade and try again.', 'staffDirectory' ), $GLOBALS['wp_version'] );
	printf( '<div class="error"><p>%s</p></div>', $message );
}

/**
 * Prevents the Customizer from being loaded on WordPress versions prior to 4.7.
 *
 * @since Staff Directory 1.0
 *
 * @global string $wp_version WordPress version.
 */
function staffDirectory_customize() {
	wp_die( sprintf( __( 'Staff Directory requires at least WordPress version 4.7. You are running version %s. Please upgrade and try again.', 'staffDirectory' ), $GLOBALS['wp_version'] ), '', array(
		'back_link' => true,
	) );
}
add_action( 'load-customize.php', 'staffDirectory_customize' );

/**
 * Prevents the Theme Preview from being loaded on WordPress versions prior to 4.7.
 *
 * @since Staff Directory 1.0
 *
 * @global string $wp_version WordPress version.
 */
function staffDirectory_preview() {
	if ( isset( $_GET['preview'] ) ) {
		wp_die( sprintf( __( 'Staff Directory requires at least WordPress version 4.7. You are running version %s. Please upgrade and try again.', 'staffDirectory' ), $GLOBALS['wp_version'] ) );
	}
}
add_action( 'template_redirect', 'staffDirectory_preview' );
