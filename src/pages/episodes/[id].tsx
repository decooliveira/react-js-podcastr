import { GetStaticPaths, GetStaticProps } from 'next';
import { format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

type Episode = {

  id: string;
  title: string;
  thumbnail: string,
  members: string,
  publishedAt: string,
  duration: number,
  durationAsString: string,
  url: string,
  description:string
}

type EpisodeProps = {
    episode:Episode
}

export default function Episode({episode}:EpisodeProps){
    return(
        <h1>  {episode.title}</h1>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking',
    }
}
export const getStaticProps: GetStaticProps  = async (context) => {
    const { id } = context.params; //use 'context'instead of useRouter when in GetStaticProps method
    const { data } = await api.get(`/episodes/${id}`)

    const episode = {
        id:data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', {locale:ptBR}),
        duration:data.file.duration,
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
        members: data.members
    }
    return {
        props: {
            episode
        }, 
        revalidate: 60 * 60 * 24, //24 hours
    }
}
