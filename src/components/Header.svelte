<script>
	import wordmark from "$svg/wordmark.svg";
</script>

<header>
	<div class="wordmark">
		<a href="https://pudding.cool" aria-label="The Pudding" target="_self"
			>{@html wordmark}</a
		>
	</div>
	<div class="filler"></div>
</header>

<style>
	header {
		background: #e9abff;
		position: relative;
	}

	.filler {
		content: "";
		height: 4px;
		top: 99%;
		position: absolute;
		width: 100%;
		left: 0px;
		background: #e9abff;
	}
	.wordmark {
		width: 70%;
		max-width: 20em;
		margin: 0 auto;
		padding: 1em 0;
	}

	.wordmark a {
		border: none;
		display: block;
		color: var(--color-fg);
	}

	.wordmark a:hover {
		background-color: transparent;
	}
	header .wordmark svg {
		width: 100%;
	}
	header .wordmark svg path {
		fill: black !important;
	}
</style>
