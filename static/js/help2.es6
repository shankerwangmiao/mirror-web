---
---

(()=>{
const globalOptions = {% include options.json %}.options;

const helpContent = new Vue({
	data: {
		"http_protocol": "https://",
		"sudo": "sudo ",
		"mirror": document.getElementById("data-mirror").value,
		"selected": {},
	},
	computed: {
		"sudoE": ()=>this.sudo == "sudo " ? "sudo -E " : "",
	},
	methods: {
		updateSelected: function(){
			for(let i in this.selected){
				this.$data[i] = this.selected[i];
			}
		}
	},
	watch: {
		"selected": "updateSelected",
	}
});

let totalCodeBlock = 0;

Vue.component('code-block', {
	props: {
		menus: Array,
		selected: Object,
	},
	model: {
		prop: "selected",
		event: "change",
	},
	data: (thisComponent) => ({
		selection: thisComponent.menus ? thisComponent.menus.map(()=>0) : {},
		blockId: totalCodeBlock++,
	}),
	methods: {
		genSelectId: function(index){return `codeblock-${this.blockId}-menu-${index}`;},
		updateSelected: function(){
			const selected = {};
			for(let i in this.menus){
				const thisSelectedItem = this.menus[i].items[this.selection[i]][1];
				for(let k in thisSelectedItem){
					selected[k] = thisSelectedItem[k];
				}
			}
			this.selected = selected;
			this.$emit('change', this.selected);
		},
	},
	watch: {
		selection: "updateSelected",
	},
	beforeMount: function(){
		this.updateSelected();
	},
	{% raw %}
	template: `
		<div>
		<div class="form-inline"  v-if="menus">
			<span class="form-group" v-for="(menu, index) in menus" :key="index">
				<label :for="genSelectId(index)">{{menu.title}}</label>
				<select :id="genSelectId(index)" class="form-control content-select" v-model="selection[index]">
					<option v-for="(opt, i) in menu.items" :value="i" :selected="i == 0">{{opt[0]}}</option>
				</select>
			</span>
		</div>
		<slot v-bind=selected></slot>
		<div>{{JSON.stringify(selection)}} {{JSON.stringify(selected)}} {{JSON.stringify(blockId)}}</div>
		</div>
	`,
	{% endraw %}

});

$(document).ready(() => {
	helpContent.$mount("#help-content");

	$('#help-select').on('change', (ev) => {
		let help_url = $(ev.target).find("option:selected").data('help-url');
		window.location = `${window.location.protocol}//${window.location.host}${help_url}`;
	});

	$.getJSON("/static/tunasync.json", (statusData) => {
		// remove help items for disabled/removed mirrors
		let availableMirrorIds = new Set(statusData.map(x => x.name));
		globalOptions.unlisted_mirrors.forEach(elem => {
			availableMirrorIds.add(elem.name)
		});
		console.log(window.mirrorId);
		if (!availableMirrorIds.has(window.mirrorId)) {
			if ({{ site.hide_mirrorz }}) {
				location.href = "/404-help-hidden.html"; // this will break 404 issue submission
			} else {
				location.href = "{{ site.mirrorz_help_link }}" + window.mirrorId; // TODO: convert this to mirrorz cname
			}
		}

		$('li').filter((_, node) => node.id && node.id.startsWith("toc-") && !availableMirrorIds.has(node.id.slice(4))).remove();
		$('option').filter((_, node) => node.id && node.id.startsWith("toc-") && !availableMirrorIds.has(node.id.slice(4))).remove();
	});
});
})();
// vim: ts=2 sts=2 sw=2 noexpandtab
