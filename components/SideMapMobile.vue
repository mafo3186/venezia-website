<template>
    <div class="sidemapMobile" ref="d3Container"></div>
    <div class="dataContainers hidden" v-for="(project, projectIndex) in projectAllData" :key="projectIndex">
       <div class="pb-3 font-semibold">{{ project.author }}</div>
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

<script setup lang="ts">
import * as d3 from 'd3';
import { getAllProjectsData, getAllImages, getAllImagesFromGallery } from '~/queries/project';
import { onMounted, nextTick, ref, createApp, h } from 'vue';
import SanityGallery from '~/components/Sanity/Gallery.vue';

const projectAllData = ref();
const projectAllImages = ref();
const projectAllImagesWithCaption = ref();
const projectAllVideos = ref();
const projectAllAudio = ref();
const d3Container = ref<SVGSVGElement | null>(null);
// let projectAllData = [];

const defaultData = {
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
}

onMounted(async () => {

    await nextTick();
    await fetchData();
    if (d3Container.value) {
        collapsibleIndent();
    }

});

async function fetchData() {
    try {
        const projectData = await useSanityQuery(getAllProjectsData);
        const projectImages = await useSanityQuery(getAllImages);
        const projectImagesFromGallery = await useSanityQuery(getAllImagesFromGallery);
        // projectMetaData = projectMetaData.data.value;
        projectAllData.value = projectData.data.value;
        projectAllImages.value = projectImages.data.value;
        projectImagesFromGallery.value = projectImagesFromGallery.data.value;

        const filterImagesWithCaptionsAndUrls = images => 
            images.filter(image => image.caption !== null && image.url);

        const extractSectionsWithTitle = (projects, sectionType) =>
            projects.flatMap(project => 
                project.sections.filter(section => section._type === sectionType && section.title)
            );

        const allImages = [...projectAllImages.value, ...projectImagesFromGallery.value];

        projectAllImagesWithCaption.value = addRefToImages(filterImagesWithCaptionsAndUrls(allImages));
        projectAllVideos.value = extractSectionsWithTitle(projectAllData.value, 'sectionVideo');
        projectAllAudio.value = extractSectionsWithTitle(projectAllData.value, 'sectionAudio');
        
    } catch (error) {
        console.error("Error fetching data", error);
    }
}

function dataIntoJson() {
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
        audioDivs.remove();
    });
    

    let fetchedDataJson = defaultData;
    
    if (projectAllData.value && Array.isArray(projectAllData.value) &&
        fetchedDataJson.children && fetchedDataJson.children[0] && Array.isArray(fetchedDataJson.children[0].children)) {

        for (let i = 0; i < projectAllData.value.length; i++) {
            if (fetchedDataJson.children[0].children[i]) {
                fetchedDataJson.children[0].children[i].name = projectAllData.value[i].title;
                fetchedDataJson.children[0].children[i].content = projectDivContents[i];
            } else {
                fetchedDataJson.children[0].children.push({
                    name: projectAllData.value[i].title,
                    content: projectDivContents[i]
                });
            }
        }

        for (let i = 0; i < projectAllAudio.value.length; i++) {
            if (fetchedDataJson.children[3].children[i]) {
                fetchedDataJson.children[3].children[i].name = projectAllAudio.value[i].title;
                fetchedDataJson.children[3].children[i].content = audioDivContents[i];
            } else {
                fetchedDataJson.children[3].children.push({
                    name: projectAllAudio.value[i].title,
                    content: audioDivContents[i]
                });
            }
        }

        for (let i = 0; i < projectAllImagesWithCaption.value.length; i++) {
            if (fetchedDataJson.children[4].children[i]) {
                fetchedDataJson.children[4].children[i].name = projectAllImagesWithCaption.value[i].caption;
                fetchedDataJson.children[4].children[i].content = imagesDivContents[i];
            } else {
                fetchedDataJson.children[4].children.push({
                    name: projectAllImagesWithCaption.value[i].caption,
                    content: imagesDivContents[i]
                });
            }
        }

        for (let i = 0; i < projectAllVideos.value.length; i++) {
            if (fetchedDataJson.children[5].children[i]) {
                fetchedDataJson.children[5].children[i].name = projectAllVideos.value[i].title;
                fetchedDataJson.children[5].children[i].content = videoDivContents[i];
            } else {
                fetchedDataJson.children[5].children.push({
                    name: projectAllVideos.value[i].title,
                    content: videoDivContents[i]
                });
            }
        }

    } else {
        console.error("Die Struktur von projectMetaData oder dataNew entspricht nicht den Erwartungen.");
    }
    
    return fetchedDataJson;
}

function addRefToImages(allImages) {
    return allImages.map(image => {
        const url = image.url;
        const parts = url.split('/');
        const filename = parts[parts.length - 1];
        const adjustedFilename = 'image-' + filename.replace('.', '-');
        return { ...image, _ref: adjustedFilename };
    });
}
function makeLink(start, end, radius) {
    const path = d3.path();
    const dh = 4 / 3 * Math.tan(Math.PI / 8); 
    let fx, fy;

    if (end[0] - start[0] === 0) {
        fx = 0;
    } else if (end[0] - start[0] > 0) {
        fx = 1;
    } else {
        fx = -1;
    }

    if (end[1] - start[1] === 0) {
        fy = 0;
    } else if (end[1] - start[1] > 0) {
        fy = 1;
    } else {
        fy = -1;
    }

    if (radius === 0) {
        fx = 0; fy = 0;
    } else {
        fx *= Math.min(Math.abs(start[0] - end[0]), radius) / radius;
        fy *= Math.min(Math.abs(start[1] - end[1]), radius) / radius;
    }

    path.moveTo(...start);
    path.lineTo(...[start[0], end[1] - fy * radius]);
    path.bezierCurveTo(
        ...[start[0], end[1] + fy * radius * (dh - 1)],
        ...[start[0] + fx * radius * (1 - dh), end[1]],
        ...[start[0] + fx * radius, end[1]]
    );
    path.lineTo(...end);
    return path.toString();
};

function mountComponent(node){
    const parentElement = document.getElementById(`component-${node.id}`);
    if (parentElement) {
        

        const convertNodeIdToIndex = node.id - 7;
        const filteredSectionGallery = projectAllData.value.map(item => {
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
}


function collapsibleIndent() {
    const indentSpacing = 12;
    const lineSpacing = 18;
    const duration = 300;
    const radius = 10;
    const minHeight = 20;
    const boxSize = 1;
    const ease = d3.easeQuadInOut;
    const marginLeft = Math.round(boxSize / 2) + 1;
    const marginRight = 120;
    const marginTop = 10;
    const marginBottom = 10;
    let openForeignObject = null;

    let width = window.innerWidth - marginLeft - marginRight;

    let tree = d3.tree()
        .nodeSize([lineSpacing, indentSpacing])

    let root = d3.hierarchy(dataIntoJson());

    root.x0 = 0;
    root.y0 = 0;
    root.descendants().forEach((d, i) => {
        d.id = i;
        d._children = d.children;
        if (d.depth && d.data.name.length !== 7) d.children = null;
    });

    let index = -1;
    root.eachBefore(function (n) { ++index }) // counts original number of items

    const svg = d3.select(d3Container.value).append('svg')
        .attr("viewBox", [-marginLeft, -marginTop, width, Math.max(minHeight, index * lineSpacing + marginTop + marginBottom)])
        .style("font", "10px sans-serif")
        .style("user-select", "none");

    const gLink = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#AAA")
        .attr("stroke-width", .75);

    const gNode = svg.append("g")
        .attr("cursor", "pointer")
        .attr("pointer-events", "all");

    let indexLast
    function update(source, contentHeight) {
        const nodes = root.descendants().reverse();
        const links = root.links();


        tree(root);

        index = -1;
        root.eachBefore(function (d) {
            d.x = ++index * lineSpacing;
           
            if (source) {
                let clickedIdThreshold;
                if (source.depth == 1) {
                    clickedIdThreshold = source.id;
                } else if (source.depth == 2) {
                    clickedIdThreshold = source.id;
                    if (d.depth == 1 && d.id > source.parent.id) {
                        d.x = d.x + contentHeight;
                    }
                }

                if (d.depth == source.depth && d.id > clickedIdThreshold) {
                    d.x = d.x + contentHeight;
                }
            }
            d.y = d.depth * indentSpacing;
        });

        const height = Math.max(minHeight, index * lineSpacing + marginTop + marginBottom + (contentHeight ? contentHeight : 0));

        svg.transition().delay(indexLast < index ? 0 : duration).duration(0)
            .attr("viewBox", [-marginLeft, - marginTop, width, height])

        // Update the nodes…
        const node = gNode.selectAll("g")
            .data(nodes, d => d.id);

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = node.enter().append("g")
            .attr("transform", d => `translate(${d.y},${source.x0})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0)
            .on("click", (event, d) => {

                root.each(node => {
                    node.x0 = node.x;
                    node.y0 = node.y;
                });

                let targetNode;
                if (d.children) {
                    d.children = null;
                    targetNode = d;
                } else {
                    d.children = d._children;
                    if (d.depth > 0 && d.parent) {
                        d.parent.children.forEach(sibling => {
                            if (sibling !== d && sibling.children) {
                                sibling.children = null;
                            }
                        });
                    }
                    targetNode = d;
                }

                const previouslyOpenNode = openForeignObject;

                if (previouslyOpenNode && previouslyOpenNode.id !== d.id) {
                    const prevForeignObject = d3.select(`#foreign-${previouslyOpenNode.id}`);
                    
                    prevForeignObject.transition().style('height', '0px');
                    d.data._foreignObjectOpen = false;
                } 
                
                
                openForeignObject = d;

                const foreigObj = document.getElementById(`foreign-${d.id}`);
                
                let foreignObjHeight = document.getElementsByClassName(`foreign-class_${d.id}`)[0]?.clientHeight + 10 || 0;
                
                if (foreigObj) {
                    d.data._foreignObjectOpen = !d.data._foreignObjectOpen;
                    foreigObj.style.height = d.data._foreignObjectOpen ? `${foreignObjHeight}px` : '0px';
                }
                let contentHeight = d.data._foreignObjectOpen ? foreignObjHeight : 0;
                mountComponent(d);
                update(d, contentHeight);
            });

        d3.selectAll('foreignObject').on('click', function(event) {
            event.stopPropagation();
        });
        // label text
        let label = nodeEnter.append("text")
            .attr("x", 5 + boxSize / 2)
            .attr("text-anchor", "start")
            .attr("dy", "0.32em")
            .attr("id", d => `title-${d.id}`)
            .text(d => d.data.name);

        const grandchildEnter = nodeEnter.filter(d => d.depth === 2);
        const widthWithoutStroke = width - 50;
        grandchildEnter.append('foreignObject')
            .attr('width', widthWithoutStroke)
            .attr('height', 0)
            .attr('x', 5)
            .attr('y', 10)
            .attr('id', d => `foreign-${d.id}`)
            .style('transition', 'height 0.3s ease-in-out')
            .style('overflow', 'hidden')
            .style('font-size', '12px')
            .append('xhtml')
            .html(function (d) {
                if (!d.data.content) return '';
                return `<div class="${"foreign-class_"+d.id}" style="background-color: white;">
                        <div id="component-${d.id}">${d.data.content}</div>
                    </div>`;

            });

        // Transition nodes to their new position.
        const nodeUpdate = node.merge(nodeEnter).transition().duration(duration).ease(ease)
            .attr("transform", d => `translate(${d.y},${d.x})`)
            .attr("fill-opacity", 1)
            .attr("stroke-opacity", 1)

        // Transition exiting nodes to the parent's new position.
        const nodeExit = node.exit().transition().duration(duration).ease(ease).remove()
            .attr("transform", d => `translate(${d.y},${source.x})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0);

        // Update the links…
        const link = gLink.selectAll("path")
            .data(links, d => d.target.id);

        // Enter any new links at the parent's previous position.
        const linkEnter = link.enter().append("path")
            .attr("stroke-opacity", 0)
            .attr("d", d => makeLink([d.source.y, source.x], [d.target.y + (d.target._children ? 0 : boxSize / 2), source.x], radius));

        // Transition links to their new position.
        link.merge(linkEnter).transition().duration(duration).ease(ease)
            .attr("stroke-opacity", 1)
            .attr("d", d => makeLink([d.source.y, d.source.x], [d.target.y + (d.target._children ? 0 : boxSize / 2), d.target.x], radius));

        // Transition exiting nodes to the parent's new position.
        link.exit().transition().duration(duration).ease(ease).remove()
            .attr("stroke-opacity", 0)
            .attr("d", d => makeLink([d.source.y, source.x], [d.target.y + (d.target._children ? 0 : boxSize / 2), source.x], radius));

        root.eachBefore(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });

        //if viewbox is expanding
        indexLast = index 
    }

    update(root);
}

</script>

<style>
.sidemapMobile {
    margin-top: 50px;
    padding-left: 1rem;
    width: 100%;
    height: auto;
}

.sidemapMobile text {
        font-size: 16px;
    }

    @media (max-width: 36rem) {
        .sidemapMobile text {
            font-size: 12px;
        }
    }
.sidemapMobile .lightbox {
    height: 0;
    width: 0;
    display: none;
}

.sidemapMobile foreignObject {
    transition: height 0.3s ease-in-out;
}
</style>