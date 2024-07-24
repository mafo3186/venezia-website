<template>
    <div class="sidemap" ref="d3Container"></div>
    <div class="dataContainers" v-for="(project, projectIndex) in projectAllData" :key="projectIndex">
          <div class="pb-20 font-semibold">{{ project.author }}</div>
          <SanityGridAltNav v-for="section in project.sections" :key="section.id" :section="section" />
    </div>
    <div class="imageContainers" v-for="(projectImages, projectIndex) in projectAllImagesWithCaption" :key="'image-' + projectIndex">
        <div ref="sectionRef" class="content-inner">
            <SanityImageOnly :section="projectImages" />
        </div>
    </div>  
    <div class="videoContainers" v-for="(projectVideos, projectIndex) in projectAllVideos" :key="'video-' + projectIndex">
        <div ref="sectionRef" class="content-inner">
            <SanityVideo :section="projectVideos" />
        </div>
    </div>  
    <div class="audioContainers" v-for="(projectAudios, projectIndex) in projectAllAudio" :key="'audio-' + projectIndex">
        <div ref="sectionRef" class="content-inner">
            <SanityAudio :section="projectAudios" />
        </div>
    </div>  
</template>

<script  lang="ts">
import * as d3 from 'd3';
import { getAllProjectsMetaData, getAllProjectsData, getAllImages, getAllImagesFromGallery } from '~/queries/project';
import { createApp, h } from 'vue';
import SanityGallery from '~/components/Sanity/Gallery.vue';


export default {
    name: 'D3Chart',

    data() {
        return {
            margin: { top: 40, right: 10, bottom: 10, left: 40 },
            width: 1000,
            dx: 50,
            dy: 200,
            projectAllData: [],
            projectAllImages: [],
            projectImagesFromGallery: [],
            projectAllImagesWithCaption: [],
            projectAllVideos: [],
            projectAllAudio: [],
            openForeignObject: null
        };
    },

    async mounted() {
        await this.fetchData();
        this.createChart();
    },

    methods: {

        async fetchData() {
            try {
                const projectMetaData = await useSanityQuery(getAllProjectsMetaData);
                const projectData = await useSanityQuery(getAllProjectsData);
                const projectImages = await useSanityQuery(getAllImages);
                const projectImagesFromGallery = await useSanityQuery(getAllImagesFromGallery);
                
                this.projectMetaData = projectMetaData.data.value;
                this.projectAllData = projectData.data.value;
                this.projectAllImages = projectImages.data.value;
                this.projectImagesFromGallery = projectImagesFromGallery.data.value;


                const imagesWithCaptionsAndUrls = [...this.projectAllImages, ...this.projectImagesFromGallery].filter(image => image.caption !== null && image.url);
                this.projectAllImagesWithCaption = this.addRefToImages(imagesWithCaptionsAndUrls);

                const videoSections = project => project.sections.filter(section => section._type === 'sectionVideo' && section.title);
                this.projectAllVideos = this.projectAllData.flatMap(videoSections);

                const audioSections = project => project.sections.filter(section => section._type === 'sectionAudio' && section.title);
                this.projectAllAudio = this.projectAllData.flatMap(audioSections);

            } catch (error) {
                console.error("Error fetching data", error);
            }
        },

        dataIntoJson() {

            const projectAllData = this.projectAllData;
            const allImagesWithCaption = this.projectAllImagesWithCaption;
            const allVideos = this.projectAllVideos;
            const allAudio = this.projectAllAudio;
            const contentDivs = document.querySelectorAll('.dataContainers');
            const imageDivs = document.querySelectorAll('.imageContainers');
            const videoDivs = document.querySelectorAll('.videoContainers');
            const audioDivs = document.querySelectorAll('.audioContainers');


            let projectDivContents: string[] = [];
            let imagesDivContents: string[] = [];
            let videoDivContents: string[] = [];
            let audioDivContents: string[] = [];

            contentDivs.forEach(contentDiv => {
                projectDivContents.push(contentDiv.innerHTML);
                contentDiv.remove();
            });

            imageDivs.forEach(imageDiv => {
                imagesDivContents.push(imageDiv.innerHTML);
                imageDiv.remove();
            });
           
            videoDivs.forEach(videoDiv => {
                videoDivContents.push(videoDiv.innerHTML);
                videoDiv.remove();
            });

            audioDivs.forEach(audioDivs => {
                audioDivContents.push(audioDivs.innerHTML);
                // audioDivs.remove();
            });
            

            let fetchedDataJson = this.getData();

            if (projectAllData && Array.isArray(projectAllData) &&
                fetchedDataJson.children && fetchedDataJson.children[0] && Array.isArray(fetchedDataJson.children[0].children)) {
                let projectCategory = fetchedDataJson.children[0].children;
                let projectAudios = fetchedDataJson.children[3].children;
                let projectImages = fetchedDataJson.children[4].children;
                let projectVideos = fetchedDataJson.children[5].children;

                for (let i = 0; i < projectAllData.length; i++) {
                    if (projectCategory[i]) {
                        projectCategory[i].name = projectAllData[i].title;
                        projectCategory[i].content = projectDivContents[i];
                    } else {
                        fetchedDataJson.children[0].children.push({
                            name: projectAllData[i].title,
                            content: projectDivContents[i]
                        });
                    }
                }

                for (let i = 0; i < allAudio.length; i++) {
                    if (projectAudios[i]) {
                        projectAudios[i].name = allAudio[i].title;
                        projectAudios[i].content = audioDivContents[i];
                    } else {
                        fetchedDataJson.children[3].children.push({
                            name: allAudio[i].title,
                            content: audioDivContents[i]
                        });
                    }
                }

                for (let i = 0; i < allImagesWithCaption.length; i++) {
                    if (projectImages[i]) {
                        projectImages[i].name = allImagesWithCaption[i].caption;
                        projectImages[i].content = imagesDivContents[i];
                    } else {
                        fetchedDataJson.children[4].children.push({
                            name: allImagesWithCaption[i].caption,
                            content: imagesDivContents[i]
                        });
                    }
                }

                for (let i = 0; i < allVideos.length; i++) {
                    if (projectVideos[i]) {
                        projectVideos[i].name = allVideos[i].title;
                        projectVideos[i].content = videoDivContents[i];
                    } else {
                        fetchedDataJson.children[5].children.push({
                            name: allVideos[i].title,
                            content: videoDivContents[i]
                        });
                    }
                }

               
                // debugger;

            } else {
                console.log("No data found");
            }
            
            return fetchedDataJson;
        },

        addRefToImages(allImages) {
            return allImages.map(image => {
                const url = image.url;
                const parts = url.split('/');
                const filename = parts[parts.length - 1];
                const adjustedFilename = 'image-' + filename.replace('.', '-');
                return { ...image, _ref: adjustedFilename };
            });
        },

        createChart() {
            const { width, margin, dx } = this;
            const data = this.dataIntoJson();

            const root = d3.hierarchy(data);
            root.x0 = 0;
            root.y0 = 0;
            const dy = (width - margin.right - margin.left) / (1 + root.height);
            const tree = d3.tree().nodeSize([dx, dy]);
            const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

            const svg = d3.select(this.$refs.d3Container).append('svg')
                .attr('width', width)
                .attr('height', dx)
                .attr('viewBox', [-margin.left, -margin.top, width, dx])
                .attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif; user-select: none;');

            const gLink = svg.append('g')
                .attr('fill', 'none')
                .attr('stroke', '#000')
                .attr('stroke-opacity', 1)
                .attr('stroke-width', 1.5);

            const gNode = svg.append('g')
                .attr('cursor', 'pointer')
                .attr('pointer-events', 'all');


            root.descendants().forEach((d, i) => {
                d.id = i;
                d._children = d.children;
                if (d.depth && d.data.name.length !== 3) d.children = null;
            });

            tree(root);

            this.update(svg, gLink, gNode, root, tree, diagonal, null, root);
        },

        update(svg, gLink, gNode, root, tree, diagonal, event, source, contentHeight, contentWidth, clickedNode) {
            
            const nodes = root.descendants().reverse();
            const links = root.links();
            tree(root);

            const adjustXPositions = (node) => {
                if (node.children && node.children.length > 0) {
                    node.x = node.children[0].x;
                    node.children.forEach(child => adjustXPositions(child));
                }
            };

            // Children should be aligned with the top child
            if (root.children && root.children.length > 0) {
                root.children.forEach(child => adjustXPositions(child));
            }

            // Root node should be aligned with the top child
            if (root.children && root.children.length > 0) {
                const topChild = root.children.reduce((top, child) => (child.x < top.x ? child : top), root.children[0]);
                root.x = topChild.x;
            }

            let left = root;
            let right = root;
            let bottom = root;
            let top = root;
            
            let index = -1;
            root.eachBefore(node => {
                ++index;
                if (node.x < left.x) left = node;
                if (node.x > right.x) right = node;
                if (node.y > bottom.y) bottom = node;
                if (node.y < top.y) top = node;
                if(clickedNode) {
                    if(node.id > clickedNode.id && clickedNode.depth == 2 && node.children == null) {
                        node.x = node.x + contentHeight;    
                    }
                }
            });

            
            // const height = right.x - left.x + this.margin.top + this.margin.bottom + (contentHeight || 0);
            const height = Math.max(10, index * this.dx + this.margin.top + this.margin.bottom + (contentHeight ? contentHeight : 0));
            const width = this.width + this.margin.left + this.margin.right + (contentWidth || 0);

            // Adjust the height and width of the SVG container
            const transition = svg.transition()
                .attr("height", height)
                .attr("width", width)
                .attr("viewBox", [-this.margin.left, left.x - this.margin.top, width, height]);

            // Update the nodes
            const node = gNode.selectAll("g")
                .data(nodes, d => d.id);

            // Enter any new nodes at the parent's previous position.
            const nodeEnter = node.enter().append("g")
                .attr("transform", d => `translate(${source.y0},${source.x0})`)
                .attr("fill-opacity", 0)
                .attr("stroke-opacity", 0);


            const grandchildEnter = nodeEnter.filter(d => d.depth === 2);
            grandchildEnter.append('foreignObject')
                .attr('width', 800)
                .attr('height', 0)
                .attr('x', 16)
                .attr('y', 10)
                .attr('id', d => `foreign-${d.id}`)
                .style('overflow', 'hidden')
                .append('xhtml')
                .html(function (d) {
                    if (!d.data.content) return '';
                    return `<div class="${"foreign-class_"+d.id}" style="background-color: white;">
                        <div id="component-${d.id}">${d.data.content}</div>
                    </div>`;

                });

            nodeEnter.append("text")
                .attr("dy", "0.31em")
                .attr("x", d => {
                    let offset = d.depth === 0 ? -6 : 6;
                    if (d.depth > 1) offset += 10;
                    return offset;
                })
                .attr("text-anchor", d => d.depth === 0 ? "end" : "start")
                .text(d => d.data.name)
                .attr("id", d => `title-${d.id}`)
                .attr("stroke-linejoin", "round")
                .attr("stroke-width", 3)
                .attr("stroke", "white")
                .attr("paint-order", "stroke");


            nodeEnter.on("click", (event, clickedNode) => {
                root.each(node => {
                    node.x0 = node.x;
                    node.y0 = node.y;
                });

                
                let targetNode;
                if (clickedNode.children) {
                    clickedNode.children = null;
                    targetNode = clickedNode;
                } else {
                    clickedNode.children = clickedNode._children;
                    if (clickedNode.depth > 0 && clickedNode.parent) {
                        clickedNode.parent.children.forEach(sibling => {
                            if (sibling !== clickedNode && sibling.children) {
                                sibling.children = null;
                            }
                        });
                    }
                    targetNode = clickedNode;
                }

                const foreignObject = d3.select(`#foreign-${clickedNode.id}`);

                if (clickedNode.depth === 2) {
                    const previouslyOpenNode = this.openForeignObject;

                    if (previouslyOpenNode && previouslyOpenNode.id !== clickedNode.id) {
                        const prevForeignObject = d3.select(`#foreign-${previouslyOpenNode.id}`);
                        prevForeignObject.transition().style('height', '0px');
                        clickedNode.data._foreignObjectOpen = false;
                    }
                    
                    this.openForeignObject = clickedNode;

                    foreignObject.transition()
                        .attr('height', `${contentHeight ? contentHeight : 0}px`)
                        .on('end', () => {
                            foreignObject.style('border', 'none');
                            this.updateNodePositions(svg, gLink, gNode, root, tree, diagonal, clickedNode);
                            this.mountComponent(clickedNode);
                        });

                }

                this.update(svg, gLink, gNode, root, tree, diagonal, event, targetNode);
            });

            d3.selectAll('foreignObject').on('click', function(event) {
                event.stopPropagation();
            });

            // Transition nodes to their new position.
            const nodeUpdate = node.merge(nodeEnter).transition(transition)
                .attr("transform", d => `translate(${d.y},${d.x})`)
                .attr("fill-opacity", 1)
                .attr("stroke-opacity", 1);


            // Transition exiting nodes to the parent's new position.
            const nodeExit = node.exit().transition(transition).remove()
                .attr("transform", d => `translate(${source.y},${source.x})`)
                .attr("fill-opacity", 0)
                .attr("stroke-opacity", 0);

            // Update the link
            const link = gLink.selectAll("path")
                .data(links, d => d.target.id);

            // Enter any new links at the parent's previous position.
            const linkEnter = link.enter().append("path")
                .attr("d", d => {
                    const o = { x: source.x0, y: source.y0 };
                    return diagonal({ source: o, target: o });
                });

            // Transition links to their new position.
            const childAdjustLink = d => d.source.depth === 1 && d.target.depth === 2;
            const childOffset = 100;

            // Adjust the link position for the children nodes to avoid overlapping    
            link.merge(linkEnter).transition(transition)
                .attr("d", d => {
                    const targetOffset = d.target.depth > 1 ? 10 : 0;
                    const sourceOffset = childAdjustLink(d) ? childOffset : 0;

                    const source = { x: d.source.x, y: d.source.y + sourceOffset };
                    const target = { x: d.target.x, y: d.target.y + targetOffset };
                    return diagonal({ source, target });
                });

            link.exit().transition(transition).remove()
                .attr("d", d => {
                    const o = { x: source.x, y: source.y };
                    return diagonal({ source: o, target: o });
                });

            root.eachBefore(d => {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        },

        updateNodePositions(svg, gLink, gNode, root, tree, diagonal, clickedNode) {
            const foreigObj = document.getElementById(`foreign-${clickedNode.id}`);
            let foreignObjHeight = document.querySelector(`.foreign-class_${clickedNode.id}`)?.clientHeight + 10 || 0;

            if (foreigObj) {
                clickedNode.data._foreignObjectOpen = !clickedNode.data._foreignObjectOpen;
                foreigObj.style.height = clickedNode.data._foreignObjectOpen ? `${foreignObjHeight}px` : '0px';
            }

            let contentHeight = clickedNode.data._foreignObjectOpen ? foreignObjHeight : 0;
            let contentWidth = clickedNode.data._foreignObjectOpen ? 800 : 0;


            this.update(svg, gLink, gNode, root, tree, diagonal, null, clickedNode, contentHeight, contentWidth, clickedNode);

        },

        mountComponent(node){
            const parentElement = document.getElementById(`component-${node.id}`);
            if (parentElement) {
                
                const convertNodeIdToIndex = node.id - 7;
                const filteredSectionGallery = this.projectAllData.map(item => {
                    const filteredSections = item.sections.filter(section => section._type === 'sectionGallery');
                    return { sections: filteredSections };
                });
                
                
                const existingGalleryContainer = parentElement.querySelectorAll('.gallery-container');

                
                
                if (!parentElement.querySelector(`.gallery-inner-${node.id}`) && existingGalleryContainer.length > 0) {
                    
                    for (let index = 0; index < filteredSectionGallery[convertNodeIdToIndex].sections.length; index++) {  
                        
                        // existingGalleryContainer[index].replace(newContainer);
                        const newContainer = document.createElement('div');
                        newContainer.className = `gallery-inner-${index}-${node.id}`;

                        const existingContainer = parentElement.querySelector(`.gallery-inner-${index}-${node.id}`);
                        if (existingContainer) {
                            // parentElement.replaceChild(newContainer, existingContainer);
                        } else {
                            existingGalleryContainer[index].innerHTML = '';

                            let nextPelement = existingGalleryContainer[index].nextElementSibling;
                            
                            if (nextPelement) {
                                nextPelement.innerHTML = '';
                            }
                            existingGalleryContainer[index].appendChild(newContainer);
                            
                        }
                        createApp({
                            render() {
                                return h(SanityGallery, { section: filteredSectionGallery[convertNodeIdToIndex].sections[index]});
                            }
                        }).mount(newContainer);
                        
                        // console.log('SanityGallery mounted successfully');
                    }
                } else {
                    // console.log('SanityGallery not mounted');
                }
            }
        },

        wrap(text, width) {
            text.each(function () {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    y = text.attr("y"),
                    dy = parseFloat(text.attr("dy")),
                    tspan = text.text(null).append("tspan").attr("x", 16).attr("y", y).attr("dy", dy + "em");
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan").attr("x", 16).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                    }
                }
            });
        },

        getData() {
            return {
                "name": "",
                "children": [
                    {
                        "name": "Projekte",
                        "children": [
                            {
                                "name": "Farbesinfonie der Erdtiefen",
                                "content": {
                                    "title": " Grandchild 1 title sit amet,",
                                    "description": "description Lorem ipsum dolor sit amet,ultricies, nunc nunc.",
                                    "image": "https://via.placeholder.com/150/0000FF/808080?Text=Digital.com"
                                }
                            },
                            {
                                "name": "Die Verborgene Welt der Höhlenmalerei",
                                "content": {
                                    "title": "Grandchild 2 title ",
                                    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies, nunc nunc.",
                                    "image": "https://via.placeholder.com/150/0000FF/808080?Text=Digital.com"
                                },
                            },
                            {
                                "name": "Höhlenzauber: Künstlerische Ekstatse",
                                "content": {
                                    "title": "Grandchild 3 title ",
                                    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies, nunc nunc.",
                                    "image": "https://via.placeholder.com/150/0000FF/808080?Text=Digital.com"
                                },
                            }
                        ]
                    },
                    {
                        "name": "Exkursion",
                        "children": [
                            {
                                "name": "Dordogne, Höhlenmalereien",
                                "content": "Im Rahmen unserer faszinierenden Exkursion begaben wir uns mit den Studierenden auf eine aufregende Reise zu den beeindruckenden Höhlenmalereien in Frankreich. Unsere Expedition führte uns tief in die prähistorische Kunst und Kultur zurück, während wir die geheimnisvollen Zeichnungen bewunderten, die vor Jahrtausenden von unseren Vorfahren geschaffen wurden. Die Höhlenmalereien erzählen eine einzigartige Geschichte von der menschlichen Entwicklung und hinterließen einen bleibenden Eindruck auf uns alle. Diese immersive Erfahrung stärkte nicht nur unser Verständnis für die Vergangenheit, sondern förderte auch den interaktiven Austausch und die Begeisterung unter den Studierenden.",
                            }
                        ]
                    },
                    {
                        "name": "Hörstück",
                        "children": ""
                    },
                    {
                        "name": "Audio",
                        "children": ""
                    },
                    {
                        "name": "Bilder",
                        "children": [
                            { "name": "Test Bild name" },


                        ]
                    },
                    {
                        "name": "Videos",
                        "children": [
                            { "name": "Test Video name" },


                        ]
                    }
                ]
            };
        }
    }
};
</script>

<style>
    .sidemap text {
        font-size: 16px;
    }

    @media (max-width: 36rem) {
        .sidemap text {
            font-size: 12px;
        }
    }

    .sidemap foreignObject {
        font-size: 1rem;
    }

    .sidemap {
        position: absolute;
        top: 30%;
        margin-left: 4.5rem;
    }

    .sidemap .lightbox {
        height: 0;
        width: 0;
        display:none;
    }
</style>