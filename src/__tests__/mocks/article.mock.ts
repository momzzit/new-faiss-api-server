import { Article } from '../../types';

export const mockArticles: Article[] = [
    {
        id: 'test-1',
        title: '삼성전자 주가 하락 원인 분석',
        content: '삼성전자 주가가 하락한 주요 원인은 글로벌 반도체 시장의 불확실성과 수요 둔화로 인한 것으로 분석됩니다.',
        url: 'http://test.com/article1',
        company: '삼성전자',
        embedding: new Array(128).fill(0.1),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'test-2',
        title: 'SK하이닉스 실적 전망',
        content: 'SK하이닉스의 실적 전망이 긍정적으로 제시되며, 메모리 반도체 시장의 회복세가 예상됩니다.',
        url: 'http://test.com/article2',
        company: 'SK하이닉스',
        embedding: new Array(128).fill(0.2),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
]; 