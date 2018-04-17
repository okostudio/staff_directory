<?php

get_header(); 

?>





<!-- ============================= 
//
//	STAFF MEMBER DIRECTORY
//
============================= -->
<div class="nav-holder">
	<h2>Teams:</h2>
	<ul id="teams" class="nav filterList teams"></ul>
	<h2>Region:</h2>
	<ul id="regions" class="nav filterList regions">
		<li class="selected">Coming soon...</li>
		<li>Sydney</li>
		<li>Auckland</li>
		<li>Melbourne</li>
	</ul>
	<h2>Sort By:</h2>
	<ul class="nav sort">
		<li class="button icon alpha selected"></li>
		<li class="button icon happy"></li>
		<!-- <li class="button icon time"></li> -->
	</ul>
	<div class="logo"></div>
</div>
<div class="staff-members"></div>

<?php

get_footer(); 

?>